import { IRange } from "monaco-editor";
import monaco from "../../../types/monaco";

export function getBlockCompletionItems(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: '(address): Current block miner’s address',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'coinbase',
            label: 'coinbase',
            range,
        },
        {
            detail: '(bytes32): DEPRICATED In 0.4.22 use blockhash(uint) instead. Hash of the given block - only works for 256 most recent blocks excluding current',
            insertText: 'blockhash(${1:blockNumber});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'blockhash',
            range
        },
        {
            detail: '(uint): current block difficulty',
            kind: monaco.languages.CompletionItemKind.Property,
            label: 'difficulty',
            insertText: 'difficulty',
            range
        },
        {
            detail: '(uint): current block gaslimit',
            kind: monaco.languages.CompletionItemKind.Property,
            label: 'gaslimit',
            insertText: 'gaslimit',
            range
        },
        {
            detail: '(uint): current block number',
            kind: monaco.languages.CompletionItemKind.Property,
            label: 'number',
            insertText: 'number',
            range
        },
        {
            detail: '(uint): current block timestamp as seconds since unix epoch',
            kind: monaco.languages.CompletionItemKind.Property,
            label: 'timestamp',
            insertText: 'timestamp',
            range
        },
    ];
}

export function getCompletionSnippets(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            label: 'contract',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'contract ${1:Name} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'library',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'library ${1:Name} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'interface',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'interface ${1:Name} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'enum',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'enum ${1:Name} {${2:item1}, ${3:item2} }',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'function',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'function ${1:name}(${2:params}) {\n\t${3:code}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'constructor',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'constructor(${1:params}) {\n\t${2:code}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'ifstatement',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2:code}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'ifstatementelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2:code}\n} else {\n\t${3:code}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'pragma',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// SPDX-License-Identifier: MIT\npragma solidity ${1:version};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'import',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'import "${1:library}";',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        },
        {
            label: 'SPDX-License-Identifier',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// SPDX-License-Identifier: MIT',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
        }
    ]
}

export function getTxCompletionItems(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: '(uint): gas price of the transaction',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'gas',
            label: 'gas',
            range
        },
        {
            detail: '(address): sender of the transaction (full call chain)',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'origin',
            label: 'origin',
            range
        },
    ];
}

export function getMsgCompletionItems(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: '(bytes): complete calldata',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'data',
            label: 'data',
            range
        },
        {
            detail: '(uint): remaining gas DEPRICATED in 0.4.21 use gasleft()',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'gas',
            label: 'gas',
            range
        },
        {
            detail: '(address): sender of the message (current call)',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'sender',
            label: 'sender',
            range
        },
        {
            detail: '(bytes4): first four bytes of the calldata (i.e. export function identifier)',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'sig',
            label: 'sig',
            range
        },
        {
            detail: '(uint): number of wei sent with the message',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'value',
            label: 'value',
            range
        },
    ];
}

export function getAbiCompletionItems(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: 'encode(..) returs (bytes): ABI-encodes the given arguments',
            insertText: 'encode(${1:arg});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'encode',
            range
        },
        {
            detail: 'encodePacked(..) returns (bytes): Performes packed encoding of the given arguments',
            insertText: 'encodePacked(${1:arg});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'encodePacked',
            range
        },
        {
            detail: 'encodeWithSelector(bytes4,...) returns (bytes): ABI-encodes the given arguments starting from the second and prepends the given four-byte selector',
            insertText: 'encodeWithSelector(${1:bytes4}, ${2:arg});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'encodeWithSelector',
            range
        },
        {
            detail: 'encodeWithSignature(string,...) returns (bytes): Equivalent to abi.encodeWithSelector(bytes4(keccak256(signature), ...)`',
            insertText: 'encodeWithSignature(${1:signatureString}, ${2:arg});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'encodeWithSignature',
            range
        },
    ];
}


export function GetCompletionTypes(range: IRange, monaco): monaco.languages.CompletionItem[] {
    const completionItems = [];
    const types = ['address', 'string', 'bytes', 'byte', 'int', 'uint', 'bool', 'hash'];
    for (let index = 8; index <= 256; index += 8) {
        types.push('int' + index);
        types.push('uint' + index);
        types.push('bytes' + index / 8);
    }
    types.forEach(type => {
        const completionItem = CreateCompletionItem(type, monaco.languages.CompletionItemKind.Keyword, type + ' type', range);
        completionItems.push(completionItem);
    });
    // add mapping
    return completionItems;
}

function CreateCompletionItem(label: string, kind: monaco.languages.CompletionItemKind, detail: string, range: IRange) {
    const completionItem: monaco.languages.CompletionItem = {
        label,
        kind,
        detail,
        insertText: label,
        range
    }
    completionItem.kind = kind;
    completionItem.detail = detail;
    return completionItem;
}

export function GetCompletionKeywords(range: IRange, monaco): monaco.languages.CompletionItem[] {
    const completionItems = [];
    const keywords = ['modifier', 'mapping', 'break', 'continue', 'delete', 'else', 'for',
        'if', 'new', 'return', 'returns', 'while', 'using', 'emit',
        'private', 'public', 'external', 'internal', 'payable', 'nonpayable', 'view', 'pure', 'case', 'do', 'else', 'finally',
        'in', 'instanceof', 'return', 'throw', 'try', 'catch', 'typeof', 'yield', 'void', 'virtual', 'override'];
    keywords.forEach(unit => {
        const completionItem: monaco.languages.CompletionItem = {
            label: unit,
            kind: monaco.languages.CompletionItemKind.Keyword,
            detail: unit + ' keyword',
            insertText: `${unit} `,
            range
        }
        completionItems.push(completionItem);
    });

    completionItems.push(CreateCompletionItem('contract', monaco.languages.CompletionItemKind.Class, null, range));
    completionItems.push(CreateCompletionItem('library', monaco.languages.CompletionItemKind.Class, null, range));
    completionItems.push(CreateCompletionItem('storage', monaco.languages.CompletionItemKind.Field, null, range));
    completionItems.push(CreateCompletionItem('memory', monaco.languages.CompletionItemKind.Field, null, range));
    completionItems.push(CreateCompletionItem('var', monaco.languages.CompletionItemKind.Field, null, range));
    completionItems.push(CreateCompletionItem('constant', monaco.languages.CompletionItemKind.Constant, null, range));
    completionItems.push(CreateCompletionItem('immutable', monaco.languages.CompletionItemKind.Keyword, null, range));
    completionItems.push(CreateCompletionItem('constructor', monaco.languages.CompletionItemKind.Constructor, null, range));
    completionItems.push(CreateCompletionItem('event', monaco.languages.CompletionItemKind.Event, null, range));
    completionItems.push(CreateCompletionItem('import', monaco.languages.CompletionItemKind.Module, null, range));
    completionItems.push(CreateCompletionItem('enum', monaco.languages.CompletionItemKind.Enum, null, range));
    completionItems.push(CreateCompletionItem('struct', monaco.languages.CompletionItemKind.Struct, null, range));
    completionItems.push(CreateCompletionItem('function', monaco.languages.CompletionItemKind.Function, null, range));

    return completionItems;
}


export function GeCompletionUnits(range: IRange, monaco): monaco.languages.CompletionItem[] {
    const completionItems = [];
    const etherUnits = ['wei', 'gwei', 'finney', 'szabo', 'ether'];
    etherUnits.forEach(unit => {
        const completionItem = CreateCompletionItem(unit, monaco.languages.CompletionItemKind.Unit, unit + ': ether unit', range);
        completionItems.push(completionItem);
    });

    const timeUnits = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'years'];
    timeUnits.forEach(unit => {
        const completionItem = CreateCompletionItem(unit, monaco.languages.CompletionItemKind.Unit, unit + ': time unit', range);
        completionItem.kind = monaco.languages.CompletionItemKind.Unit;

        if (unit !== 'years') {
            completionItem.detail = unit + ': time unit';
        } else {
            completionItem.detail = 'DEPRECATED: ' + unit + ': time unit';
        }
        completionItems.push(completionItem);
    });

    return completionItems;
}

export function GetGlobalVariable(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: 'Current block',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'block',
            label: 'block',
            range
        },
        {
            detail: 'Current Message',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'msg',
            label: 'msg',
            range
        },
        {
            detail: '(uint): current block timestamp (alias for block.timestamp)',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'now',
            label: 'now',
            range
        },
        {
            detail: 'Current transaction',
            kind: monaco.languages.CompletionItemKind.Variable,
            label: 'tx',
            insertText: 'tx',
            range
        },
        {
            detail: 'ABI encoding / decoding',
            kind: monaco.languages.CompletionItemKind.Variable,
            label: 'abi',
            insertText: 'abi',
            range
        },
        {
            detail: '',
            kind: monaco.languages.CompletionItemKind.Variable,
            label: 'this',
            insertText: 'this',
            range
        },
    ];
}

export function GetGlobalFunctions(range: IRange, monaco): monaco.languages.CompletionItem[] {
    return [
        {
            detail: 'assert(bool condition): throws if the condition is not met - to be used for internal errors.',
            insertText: 'assert(${1:condition});',
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'assert',
            range
        },
        {
            detail: 'gasleft(): returns the remaining gas',
            insertText: 'gasleft();',
            kind: monaco.languages.CompletionItemKind.Function,
            label: 'gasleft',
            range
        },
        {
            detail: 'unicode: converts string into unicode',
            insertText: 'unicode"${1:text}"',
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'unicode',
            range
        },
        {
            detail: 'blockhash(uint blockNumber): hash of the given block - only works for 256 most recent, excluding current, blocks',
            insertText: 'blockhash(${1:blockNumber});',
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'blockhash',
            range
        },
        {
            detail: 'require(bool condition): reverts if the condition is not met - to be used for errors in inputs or external components.',
            insertText: 'require(${1:condition});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'require',
            range
        },
        {
            // tslint:disable-next-line:max-line-length
            detail: 'require(bool condition, string message): reverts if the condition is not met - to be used for errors in inputs or external components. Also provides an error message.',
            insertText: 'require(${1:condition}, ${2:message});',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'require',
            range
        },
        {
            detail: 'revert(): abort execution and revert state changes',
            insertText: 'revert();',
            kind: monaco.languages.CompletionItemKind.Method,
            label: 'revert',
            range
        },
        {
            detail: 'addmod(uint x, uint y, uint k) returns (uint):' +
                'compute (x + y) % k where the addition is performed with arbitrary precision and does not wrap around at 2**256',
            insertText: 'addmod(${1:x}, ${2:y}, ${3:k})',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'addmod',
            range
        },
        {
            detail: 'mulmod(uint x, uint y, uint k) returns (uint):' +
                'compute (x * y) % k where the multiplication is performed with arbitrary precision and does not wrap around at 2**256',
            insertText: 'mulmod(${1:x}, ${2:y}, ${3:k})',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'mulmod',
            range
        },
        {
            detail: 'keccak256(...) returns (bytes32):' +
                'compute the Ethereum-SHA-3 (Keccak-256) hash of the (tightly packed) arguments',
            insertText: 'keccak256(${1:x})',
            kind: monaco.languages.CompletionItemKind.Method,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            label: 'keccak256',
            range
        },
        {
            detail: 'sha256(...) returns (bytes32):' +
                'compute the SHA-256 hash of the (tightly packed) arguments',
            insertText: 'sha256(${1:x})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Method,
            label: 'sha256',
            range
        },
        {
            detail: 'sha3(...) returns (bytes32):' +
                'alias to keccak256',
            insertText: 'sha3(${1:x})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Method,
            label: 'sha3',
            range
        },
        {
            detail: 'ripemd160(...) returns (bytes20):' +
                'compute RIPEMD-160 hash of the (tightly packed) arguments',
            insertText: 'ripemd160(${1:x})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Method,
            label: 'ripemd160',
            range
        },
        {
            detail: 'ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address):' +
                'recover the address associated with the public key from elliptic curve signature or return zero on error',
            insertText: 'ecrecover(${1:hash}, ${2:v}, ${3:r}, ${4:s})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Method,
            label: 'ecrecover',
            range
        },

    ];
}

export function getContextualAutoCompleteByGlobalVariable(word: string, range: IRange, monaco): monaco.languages.CompletionItem[] {
    if (word === 'block') {
        return getBlockCompletionItems(range, monaco);
    }
    if (word === 'msg') {
        return getMsgCompletionItems(range, monaco);
    }
    if (word === 'tx') {
        return getTxCompletionItems(range, monaco);
    }
    if (word === 'address') {
        return getAbiCompletionItems(range, monaco);
    }
    return null;
}