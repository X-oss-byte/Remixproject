'use strict'
import { Plugin } from '@remixproject/engine'
import { sourceMappingDecoder } from '@remix-project/remix-debug'
import { CompilerAbstract } from '@remix-project/remix-solidity'
import { Compiler } from '@remix-project/remix-solidity'

import { AstNode, CompilationError, CompilationResult, CompilationSource } from '@remix-project/remix-solidity'
import { helper } from '@remix-project/remix-solidity'
import CodeParserGasService from './services/code-parser-gas-service'
import CodeParserCompiler from './services/code-parser-compiler'
import CodeParserAntlrService from './services/code-parser-antlr-service'
import CodeParserNodeHelper from './services/code-parser-node-helper'
import React from 'react'
import { fileDecoration, fileDecorationType } from '@remix-ui/file-decorators'

import { Profile } from '@remixproject/plugin-utils'
// eslint-disable-next-line




const profile: Profile = {
    name: 'codeParser',
    methods: ['nodesAtPosition', 'getLineColumnOfNode', 'getLineColumnOfPosition', 'getFunctionParamaters', 'getDeclaration', 'getFunctionReturnParameters', 'getVariableDeclaration', 'getNodeDocumentation', 'getNodeLink', 'listAstNodes', 'getBlockAtPosition', 'getLastNodeInLine', 'resolveImports', 'parseSolidity', 'getNodesWithScope', 'getNodesWithName', 'getNodes', 'compile', 'getNodeById', 'getLastCompilationResult', 'positionOfDefinition', 'definitionAtPosition', 'jumpToDefinition', 'referrencesAtPosition', 'referencesOf', 'getActiveHighlights', 'gasEstimation', 'declarationOf', 'getGasEstimates'],
    events: [],
    version: '0.0.1'
}

export function isNodeDefinition(node: any) {
    return node.nodeType === 'ContractDefinition' ||
        node.nodeType === 'FunctionDefinition' ||
        node.nodeType === 'ModifierDefinition' ||
        node.nodeType === 'VariableDeclaration' ||
        node.nodeType === 'StructDefinition' ||
        node.nodeType === 'EventDefinition'
}

export class CodeParser extends Plugin {

    currentFileAST: any // contains the simple parsed AST for the current file

    lastCompilationResult: any
    currentFile: any
    _index: any
    astWalker: any
    errorState: boolean = false

    gastEstimateTimeOut: any

    gasService: CodeParserGasService
    compilerService: CodeParserCompiler
    antlrService: CodeParserAntlrService
    nodeHelper: CodeParserNodeHelper

    parseSolidity: (text: string) => Promise<any>
    getLastNodeInLine: (ast: string) => Promise<any>
    listAstNodes: () => Promise<any>
    getBlockAtPosition: (position: any, text?: string) => Promise<any>

    constructor(astWalker) {
        super(profile)
        this.astWalker = astWalker
        this._index = {
            Declarations: {},
            FlatReferences: {}
        }
    }

    async onActivation() {

        this.gasService = new CodeParserGasService(this)
        this.compilerService = new CodeParserCompiler(this)
        this.antlrService = new CodeParserAntlrService(this)
        this.nodeHelper = new CodeParserNodeHelper(this)

        this.parseSolidity = this.antlrService.parseSolidity
        this.getLastNodeInLine = this.antlrService.getLastNodeInLine
        this.listAstNodes = this.antlrService.listAstNodes
        this.getBlockAtPosition = this.antlrService.getBlockAtPosition

        this.on('editor', 'didChangeFile', async (file) => {
            console.log('contentChanged', file)
            await this.call('editor', 'discardLineTexts')
            await this.antlrService.getCurrentFileAST()
            await this.compilerService.compile()
        })

        this.on('filePanel', 'setWorkspace', async () => {
            await this.call('fileDecorator', 'setFileDecorators', [])
        })


        this.on('fileManager', 'currentFileChanged', async () => {
            await this.call('editor', 'discardLineTexts')
            await this.antlrService.getCurrentFileAST()
            await this.compilerService.compile()
        })

        this.on('solidity', 'loadingCompiler', async (url) => {
            console.log('loading compiler', url)
            this.compilerService.compiler.loadVersion(true, url)
            this.compilerService.compiler.event.register('compilerLoaded', async () => {
                console.log('compiler loaded')
            })
        })

        await this.compilerService.init()

    }



    /**
     * 
     * @returns 
     */
    async getLastCompilationResult() {
        return this.lastCompilationResult
    }





    /**
     * Builds a flat index and declarations of all the nodes in the compilation result
     * @param compilationResult 
     * @param source 
     */
    _buildIndex(compilationResult, source) {
        if (compilationResult && compilationResult.sources) {
            const callback = (node) => {
                if (node && node.referencedDeclaration) {
                    if (!this._index.Declarations[node.referencedDeclaration]) {
                        this._index.Declarations[node.referencedDeclaration] = []
                    }
                    this._index.Declarations[node.referencedDeclaration].push(node)
                }
                this._index.FlatReferences[node.id] = node
            }
            for (const s in compilationResult.sources) {
                this.astWalker.walkFull(compilationResult.sources[s].ast, callback)
            }

        }
    }

    // NODE HELPERS

    _getInputParams(node) {
        const params = []
        const target = node.parameters
        if (target) {
            const children = target.parameters
            for (const j in children) {
                if (children[j].nodeType === 'VariableDeclaration') {
                    params.push(children[j].typeDescriptions.typeString)
                }
            }
        }
        return '(' + params.toString() + ')'
    }


    _flatNodeList(node: any, contractName: string, fileName: string, compilatioResult: any) {
        const index = {}
        const callback = (node) => {
            node.gasEstimate = this._getContractGasEstimate(node, contractName, fileName, compilatioResult)
            node.functionName = node.name + this._getInputParams(node)
            index[node.id] = node
        }
        this.astWalker.walkFull(node, callback)
        return index
    }

    _extractFileNodes(fileName: string, compilatioResult: any) {
        if (compilatioResult && compilatioResult.data.sources && compilatioResult.data.sources[fileName]) {
            const source = compilatioResult.data.sources[fileName]
            const nodesByContract = []
            this.astWalker.walkFull(source.ast, (node) => {
                if (node.nodeType === 'ContractDefinition') {
                    const flatNodes = this._flatNodeList(node, node.name, fileName, compilatioResult)
                    node.gasEstimate = this._getContractGasEstimate(node, node.name, fileName, compilatioResult)
                    nodesByContract[node.name] = { contractDefinition: node, contractNodes: flatNodes }
                }
            })
            return nodesByContract
        }
    }

    _getContractGasEstimate(node: any, contractName: string, fileName: string, compilationResult: any) {

        const contracts = compilationResult.data.contracts && compilationResult.data.contracts[this.currentFile]
        for (const name in contracts) {
            if (name === contractName) {
                const contract = contracts[name]
                const estimationObj = contract.evm && contract.evm.gasEstimates
                if (node.nodeType === 'ContractDefinition') {
                    return {
                        creationCost: estimationObj === null ? '-' : estimationObj.creation.totalCost,
                        codeDepositCost: estimationObj === null ? '-' : estimationObj.creation.codeDepositCost,
                    }
                }
                let executionCost = null
                if (node.nodeType === 'FunctionDefinition') {
                    const visibility = node.visibility
                    if (node.kind !== 'constructor') {
                        const fnName = node.name
                        const fn = fnName + this._getInputParams(node)

                        if (visibility === 'public' || visibility === 'external') {
                            executionCost = estimationObj === null ? '-' : estimationObj.external[fn]
                        } else if (visibility === 'private' || visibility === 'internal') {
                            executionCost = estimationObj === null ? '-' : estimationObj.internal[fn]
                        }
                        return { executionCost }
                    }
                }
            }
        }
    }








    /**
     * Nodes at position where position is a number, offset
     * @param position 
     * @param type 
     * @returns 
     */
    async nodesAtPosition(position: number, type = '') {
        const lastCompilationResult = this.lastCompilationResult
        if (!lastCompilationResult) return false
        const urlFromPath = await this.call('fileManager', 'getUrlFromPath', this.currentFile)
        console.log('URL FROM PATH', urlFromPath)
        if (lastCompilationResult && lastCompilationResult.languageversion.indexOf('soljson') === 0 && lastCompilationResult.data && lastCompilationResult.data.sources && lastCompilationResult.data.sources[this.currentFile]) {
            const nodes = sourceMappingDecoder.nodesAtPosition(type, position, lastCompilationResult.data.sources[this.currentFile] || lastCompilationResult.data.sources[urlFromPath.file])
            return nodes
        }
        return []
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    async getNodeById(id: any) {
        for (const key in this._index.FlatReferences) {
            if (this._index.FlatReferences[key].id === id) {
                return this._index.FlatReferences[key]
            }
        }
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    async getDeclaration(id: any) {
        if (this._index.Declarations && this._index.Declarations[id]) return this._index.Declarations[id]
    }

    /**
     * 
     * @param scope 
     * @returns 
     */
    async getNodesWithScope(scope: number) {
        const nodes = []
        for (const node of Object.values(this._index.FlatReferences) as any[]) {
            if (node.scope === scope) nodes.push(node)
        }
        return nodes
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    async getNodesWithName(name: string) {
        const nodes = []
        for (const node of Object.values(this._index.FlatReferences) as any[]) {
            if (node.name === name) nodes.push(node)
        }
        return nodes
    }
    /**
     * 
     * @param node 
     * @returns 
     */
    declarationOf(node: AstNode) {
        if (node && node.referencedDeclaration) {
            return this._index.FlatReferences[node.referencedDeclaration]
        } else {
            // console.log(this._index.FlatReferences)
        }
        return null
    }

    /**
     * 
     * @param position 
     * @returns 
     */
    async definitionAtPosition(position: number) {
        const nodes = await this.nodesAtPosition(position)
        console.log('nodes at position', nodes, position)
        console.log(this._index.FlatReferences)
        let nodeDefinition: any
        let node: any
        if (nodes && nodes.length && !this.errorState) {
            node = nodes[nodes.length - 1]
            nodeDefinition = node
            if (!isNodeDefinition(node)) {
                nodeDefinition = await this.declarationOf(node) || node
            }
            if (node.nodeType === 'ImportDirective') {
                for (const key in this._index.FlatReferences) {
                    if (this._index.FlatReferences[key].id === node.sourceUnit) {
                        nodeDefinition = this._index.FlatReferences[key]
                    }
                }
            }
            return nodeDefinition
        } else {
            const astNodes = await this.antlrService.listAstNodes()
            for (const node of astNodes) {
                if (node.range[0] <= position && node.range[1] >= position) {
                    if (nodeDefinition && nodeDefinition.range[0] < node.range[0]) {
                        nodeDefinition = node
                    }
                    if (!nodeDefinition) nodeDefinition = node
                }
            }
            if (nodeDefinition && nodeDefinition.type && nodeDefinition.type === 'Identifier') {
                const nodeForIdentifier = await this.findIdentifier(nodeDefinition)
                if (nodeForIdentifier) nodeDefinition = nodeForIdentifier
            }
            return nodeDefinition
        }

    }

    /**
     * 
     * @param identifierNode 
     * @returns 
     */
    async findIdentifier(identifierNode: any) {
        const astNodes = await this.antlrService.listAstNodes()
        for (const node of astNodes) {
            if (node.name === identifierNode.name && node.nodeType !== 'Identifier') {
                return node
            }
        }
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    async positionOfDefinition(node: any): Promise<any | null> {
        if (node) {
            if (node.src) {
                console.log('positionOfDefinition', node)
                const position = sourceMappingDecoder.decode(node.src)
                if (position) {
                    return position
                }
            }
        }
        return null
    }

    /**
     * 
     * @param node 
     * @param imported 
     * @returns 
     */
    async resolveImports(node, imported = {}) {
        if (node.nodeType === 'ImportDirective' && !imported[node.sourceUnit]) {
            console.log('IMPORTING', node)
            const importNode = await this.getNodeById(node.sourceUnit)
            imported[importNode.id] = importNode
            if (importNode.nodes) {
                for (const child of importNode.nodes) {
                    imported = await this.resolveImports(child, imported)
                }
            }
        }
        console.log(imported)
        return imported
    }



    /**
     * 
     * @param node 
     * @returns 
     */
    referencesOf(node: any) {
        const results = []
        const highlights = (id) => {
            if (this._index.Declarations && this._index.Declarations[id]) {
                const refs = this._index.Declarations[id]
                for (const ref in refs) {
                    const node = refs[ref]
                    results.push(node)
                }
            }
        }
        if (node && node.referencedDeclaration) {
            highlights(node.referencedDeclaration)
            const current = this._index.FlatReferences[node.referencedDeclaration]
            results.push(current)
        } else {
            highlights(node.id)
        }
        return results
    }

    /**
     * 
     * @param position 
     * @returns 
     */
    async referrencesAtPosition(position: any) {
        const nodes = await this.nodesAtPosition(position)
        if (nodes && nodes.length) {
            const node = nodes[nodes.length - 1]
            if (node) {
                return this.referencesOf(node)
            }
        }
    }

    /**
     * 
     * @returns 
     */
    async getNodes() {
        return this._index.FlatReferences
    }



    /**
     * 
     * @param node 
     * @returns 
     */
    async getNodeLink(node: any) {
        const lineColumn = await this.getLineColumnOfNode(node)
        const position = await this.positionOfDefinition(node)
        if (this.lastCompilationResult && this.lastCompilationResult.sources) {
            const fileName = this.lastCompilationResult.getSourceName(position.file)
            return lineColumn ? `${fileName} ${lineColumn.start.line}:${lineColumn.start.column}` : null
        }
        return ''
    }

    /*
    * @param node   
    */
    async getLineColumnOfNode(node: any) {
        const position = await this.positionOfDefinition(node)
        return this.getLineColumnOfPosition(position)
    }

    /*
    * @param position
    */
    async getLineColumnOfPosition(position: any) {
        if (position) {
            const fileName = this.lastCompilationResult.getSourceName(position.file)
            const lineBreaks = sourceMappingDecoder.getLinebreakPositions(this.lastCompilationResult.source.sources[fileName].content)
            const lineColumn = sourceMappingDecoder.convertOffsetToLineColumn(position, lineBreaks)
            return lineColumn
        }
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    async getNodeDocumentation(node: any) {
        if (node.documentation && node.documentation.text) {
            let text = ''
            node.documentation.text.split('\n').forEach(line => {
                text += `${line.trim()}\n`
            })
            return text
        }
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    async getVariableDeclaration(node: any) {
        if (node.typeDescriptions && node.typeDescriptions.typeString) {
            return `${node.typeDescriptions.typeString} ${node.visibility}${node.name && node.name.length ? ` ${node.name}` : ''}`
        } else {
            if (node.typeName && node.typeName.name) {
                return `${node.typeName.name} ${node.visibility}${node.name && node.name.length ? ` ${node.name}` : ''}`
            }
            else if (node.typeName && node.typeName.namePath) {
                return `${node.typeName.namePath} ${node.visibility}${node.name && node.name.length ? ` ${node.name}` : ''}`
            }
            else {
                return `${node.visibility}${node.name && node.name.length ? ` ${node.name}` : ''}`
            }
        }
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    async getFunctionParamaters(node: any) {
        const localParam = (node.parameters && node.parameters.parameters) || (node.parameters)
        if (localParam) {
            const params = []
            for (const param of localParam) {
                params.push(await this.getVariableDeclaration(param))
            }
            return `(${params.join(', ')})`
        }
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    async getFunctionReturnParameters(node: any) {
        const localParam = (node.returnParameters && node.returnParameters.parameters)
        if (localParam) {
            const params = []
            for (const param of localParam) {
                params.push(await this.getVariableDeclaration(param))
            }
            return `(${params.join(', ')})`
        }
    }



}