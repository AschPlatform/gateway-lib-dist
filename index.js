module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=11)}([function(t,e){t.exports=require("base58check")},function(t,e){t.exports=require("safe-buffer")},function(t,e){t.exports=require("bitcoin-core")},function(t,e){t.exports=require("bitcoincashjs")},function(t,e){var n=10,r=41,i=107,s=9,o=25;function a(t){return r+(t.script?t.script.length:i)}function u(t){return s+(t.script?t.script.length:o)}function c(t,e){return a({})*e}function l(t,e){return n+t.reduce(function(t,e){return t+a(e)},0)+e.reduce(function(t,e){return t+u(e)},0)}function h(t){return"number"!=typeof t?NaN:isFinite(t)?Math.floor(t)!==t?NaN:t<0?NaN:t:NaN}function d(t){return t.reduce(function(t,e){return t+h(e.value)},0)}var p=u({});t.exports={dustThreshold:c,finalize:function(t,e,n){var r=l(t,e),i=n*(r+p),s=d(t)-(d(e)+i);s>c(0,n)&&(e=e.concat({value:s}));var o=d(t)-d(e);return isFinite(o)?{inputs:t,outputs:e,fee:o}:{fee:n*r}},inputBytes:a,outputBytes:u,sumOrNaN:d,sumForgiving:function(t){return t.reduce(function(t,e){return t+(isFinite(e.value)?e.value:0)},0)},transactionBytes:l,uintOrNaN:h}},function(t,e){t.exports=require("bitgo-bitcoinjs-lib")},function(t,e,n){const r=n(5),i=n(2),{Buffer:s}=n(1),o=n(0),a=n(4),u=n(3);class c{constructor(t){this.network="mainnet"===t?r.networks.bitcoin:r.networks.testnet}static toCashAddrFormat(t){const e=u.Address,n=e.CashAddrFormat;return new e(t).toString(n)}static toNormalAddrFormat(t){const e=u.Address,n=e.fromString,r=e.CashAddrFormat;if(t.split(":")[1].startsWith("p")){return n(t,"testnet","scripthash",r).toString()}return n(t,"testnet","pubkeyhash",r).toString()}static coinSelect(t,e,n){if(t=t.concat().sort((t,e)=>t.value-e.value),!isFinite(a.uintOrNaN(n)))return{};let r=0,i=[],s=a.sumOrNaN(e);for(var o=0;o<t.length;++o){let u=t[o];if(r+=a.uintOrNaN(u.value),i.push(u),!(r<s+n))return{inputs:i,outputs:e,changeValue:r-(s+n)}}return{fee:n}}generateAccount(){const t=new r.ECPair.makeRandom({network:this.network});return{privateKey:t.toWIF(),publicKey:t.Q.getEncoded().toString("hex"),address:t.getAddress()}}createMultisigAddress(t,e){const n=e.map(t=>s.from(t,"hex")),i=r.script.multisig.output.encode(t,n,this.network),o=r.script.scriptHash.output.encode(r.crypto.hash160(i),this.network);return{address:r.address.fromOutputScript(o,this.network),accountExtrsInfo:{redeemScript:i}}}isValidAddress(t){try{const e=o.decode(t).prefix.toString("hex"),n="6f"===e||"c4"===e?r.networks.testnet:r.networks.bitcoin;return this.network===n}catch(t){return!1}}signTransactionWithUTXO(t,e,n,i){const o=e.privateKey,a=r.TransactionBuilder.fromTransaction(r.Transaction.fromHex(t.txhex),this.network),u=r.ECPair.fromWIF(o,this.network),c=r.Transaction.SIGHASH_ALL|r.Transaction.SIGHASH_BITCOINCASHBIP143;a.enableBitcoinCash(!0);for(let e=0;e<t.input.length;e++){const r=s.from(n[t.input[e]],"hex"),o=a.tx.ins[e].hash.reverse().toString("hex"),l=a.tx.ins[e].index,h=i[o][String(l)];a.sign(e,u,r,c,h)}const l=a.inputs.map(t=>t.signatures),h=[];for(let t=0;t<l.length;t++){let e={},n=l[t].filter(t=>Boolean(t))[0];e[String(l[t].indexOf(n))]=n.toString("hex"),h.push(e)}return h}buildSignatures(t){let e=[];for(let n=0;n<t.length;n++)for(let r=0;r<t[0].length;r++){e[r]=e[r]||[];let i=Number(Object.keys(t[n][r])[0]);e[r][i]=t[n][r][i]}return e}buildTransaction(t,e,n){let i=this.buildSignatures(e),o=[];for(let a=0;a<e[0].length;a++){let e=t.input[a];o.push({redeemScript:s.from(n[e],"hex"),redeemScriptType:"multisig",pubKeys:r.script.multisig.output.decode(s.from(n[e],"hex")).pubKeys,signatures:i[a].map(t=>s.from(t,"hex")),signScript:s.from(n[t.input[a]],"hex"),signType:"multisig",prevOutScript:r.crypto.hash160(s.from(n[e],"hex")),prevOutType:"scripthash",witness:!1})}const a=r.TransactionBuilder.fromTransaction(r.Transaction.fromHex(t.txhex),this.network);return a.inputs=o,a.build().toHex()}getSpentTidsFromRawTransaction(t){let e=[];return r.Transaction.fromHex(t).ins.forEach((t,n)=>{let r={txid:t.hash.reverse().toString("hex")};e.push(r.txid)}),e}}t.exports={Utils:c,Client:class{constructor(t,e,n,s,o){this.network="mainnet"===n?r.networks.bitcoin:r.networks.testnet,this.client=new i({username:t,password:e,network:n,port:s,host:o})}async getAddress(t,e){const n=await this.client.getRawTransaction(t);return(await this.client.decodeRawTransaction(n)).vout[e].scriptPubKey.addresses[0]}importPrivKeyToWallet(t,e){this.client.importPrivKey(t.privateKey,"",!1,e)}async getUTXOsByTransaction(t){const e=r.Transaction.fromHex(t);let n=[],i={};for(let t=0;t<e.ins.length;t++){let r={},s=e.ins[t].hash.reverse().toString("hex"),o=await this.client.getRawTransaction(s);(await this.client.decodeRawTransaction(o)).vout.map(t=>{i[t.n]=1e8*t.value}),r[s]=i,n.push(r),console.log(n)}return n}getUTXOs(t,e){this.client.listUnspent(0,(n,r)=>{if(n)return e(n);const i=r.sort((t,e)=>t.amount-e.amount).filter(e=>t.indexOf(e.txid)<0).filter(t=>""===t.account).map(t=>({txid:t.txid,vout:t.vout,value:Math.round(1e8*t.amount)}));e(null,i)})}createNewTransaction(t,e,n,i,s){i=i||1e4;let o={};this.getUTXOs(n,(n,a)=>{if(n)return s(n);let{inputs:u,outputs:l,changeValue:h}=c.coinSelect(a,e,i);if(!u||!l)return s("No inputs or outputs");let d=new r.TransactionBuilder(this.network);console.log(u);try{u.forEach(t=>d.addInput(t.txid,t.vout)),l.forEach(t=>d.addOutput(t.address,t.value)),d.addOutput(t.address,h)}catch(t){return s(t.message)}o.txhex=d.buildIncomplete().toHex();let p=[];for(let t=0;t<u.length;t++)p.push(this.getAddress(u[t].txid,u[t].vout));Promise.all(p).then(t=>{o.txhex=d.buildIncomplete().toHex(),console.log("value",t),o.input=t.map(t=>c.toNormalAddrFormat(t)),s(null,o)})})}sendRawTransaction(t,e){this.client.sendRawTransaction(t,e)}getTransactionStatus(t,e){this.client.getTransaction(t,e)}getTransactionHistory(t,e){this.client.listTransactions((n,r)=>{if(n)return e(n);const i=r.filter(e=>e.address===c.toCashAddrFormat(t));e(null,i)})}importAddress(t,e){this.client.importAddress(t,"",!1,e)}listSinceBlock(t,e){this.client.listSinceBlock(t,1,!0,e)}getTransactionsFromBlockHeight(t,e){this.client.getBlockchainInfo((n,r)=>{if(n)return e(n);this.client.getBlockHash(t,(t,n)=>{if(t)return e(t);this.client.listSinceBlock(n,1,!0,(t,n)=>{if(t)return e(t);const i=r.blocks;n.transactions.map(t=>{t.height=i-t.confirmations+1}),n.transactions.map(t=>{t.address=c.toNormalAddrFormat(t.address)}),e(null,n)})})})}getCurrentHeight(t){this.client.getBlockchainInfo((e,n)=>{if(e)return t(e);t(null,n.blocks)})}}}},function(t,e){var n=10,r=41,i=107,s=9,o=25;function a(t){return r+(t.script?t.script.length:i)}function u(t){return s+(t.script?t.script.length:o)}function c(t,e){return a({})*e}function l(t,e){return n+t.reduce(function(t,e){return t+a(e)},0)+e.reduce(function(t,e){return t+u(e)},0)}function h(t){return"number"!=typeof t?NaN:isFinite(t)?Math.floor(t)!==t?NaN:t<0?NaN:t:NaN}function d(t){return t.reduce(function(t,e){return t+h(e.value)},0)}var p=u({});t.exports={dustThreshold:c,finalize:function(t,e,n){var r=l(t,e),i=n*(r+p),s=d(t)-(d(e)+i);s>c(0,n)&&(e=e.concat({value:s}));var o=d(t)-d(e);return isFinite(o)?{inputs:t,outputs:e,fee:o}:{fee:n*r}},inputBytes:a,outputBytes:u,sumOrNaN:d,sumForgiving:function(t){return t.reduce(function(t,e){return t+(isFinite(e.value)?e.value:0)},0)},transactionBytes:l,uintOrNaN:h}},function(t,e){t.exports=require("coinselect")},function(t,e){t.exports=require("bitcoinjs-lib")},function(t,e,n){const r=n(9),i=n(2),{Buffer:s}=n(1),o=(n(8),n(0)),a=n(7);class u{constructor(t){this.network="mainnet"===t?r.networks.bitcoin:r.networks.testnet}static coinSelect(t,e,n){if(t=t.concat().sort((t,e)=>t.value-e.value),!isFinite(a.uintOrNaN(n)))return{};let r=0,i=[],s=a.sumOrNaN(e);for(var o=0;o<t.length;++o){let u=t[o];if(r+=a.uintOrNaN(u.value),i.push(u),!(r<s+n))return{inputs:i,outputs:e,changeValue:r-(s+n)}}return{fee:n}}generateAccount(){const t=new r.ECPair.makeRandom({network:this.network});return{privateKey:t.toWIF(),publicKey:t.Q.getEncoded().toString("hex"),address:t.getAddress()}}createMultisigAddress(t,e){const n=e.map(t=>s.from(t,"hex")),i=r.script.multisig.output.encode(t,n,this.network),o=r.script.scriptHash.output.encode(r.crypto.hash160(i),this.network);return{address:r.address.fromOutputScript(o,this.network),accountExtrsInfo:{redeemScript:i}}}isValidAddress(t){try{const e=o.decode(t).prefix.toString("hex"),n="6f"===e||"c4"===e?r.networks.testnet:r.networks.bitcoin;return this.network===n}catch(t){return!1}}signTransaction(t,e,n){const i=e.privateKey,o=r.TransactionBuilder.fromTransaction(r.Transaction.fromHex(t.txhex),this.network),a=r.ECPair.fromWIF(i,this.network);for(let e=0;e<t.input.length;e++){const r=s.from(n[t.input[e]],"hex");o.sign(e,a,r)}const u=o.inputs.map(t=>t.signatures),c=[];for(let t=0;t<u.length;t++){let e={},n=u[t].filter(t=>Boolean(t))[0];e[String(u[t].indexOf(n))]=n.toString("hex"),c.push(e)}return c}buildSignatures(t){let e=[];for(let n=0;n<t.length;n++)for(let r=0;r<t[0].length;r++){e[r]=e[r]||[];let i=Number(Object.keys(t[n][r])[0]);e[r][i]=t[n][r][i]}return e}buildTransaction(t,e,n){let i=this.buildSignatures(e),o=[];for(let a=0;a<e[0].length;a++){let e=t.input[a];o.push({redeemScript:s.from(n[e],"hex"),redeemScriptType:"multisig",pubKeys:r.script.multisig.output.decode(s.from(n[e],"hex")).pubKeys,signatures:i[a].map(t=>s.from(t,"hex")),signScript:s.from(n[t.input[a]],"hex"),signType:"multisig",prevOutScript:r.crypto.hash160(s.from(n[e],"hex")),prevOutType:"scripthash",witness:!1})}const a=r.TransactionBuilder.fromTransaction(r.Transaction.fromHex(t.txhex),this.network);return a.inputs=o,a.build().toHex()}getSpentTidsFromRawTransaction(t){let e=[];return r.Transaction.fromHex(t).ins.forEach((t,n)=>{let r={txid:t.hash.reverse().toString("hex")};e.push(r.txid)}),e}}t.exports={Utils:u,Client:class{constructor(t,e,n,s,o){this.network="mainnet"===n?r.networks.bitcoin:r.networks.testnet,this.client=new i({username:t,password:e,network:n,port:s,host:o})}async getAddress(t,e){const n=await this.client.getRawTransaction(t);return(await this.client.decodeRawTransaction(n)).vout[e].scriptPubKey.addresses[0]}importPrivKeyToWallet(t,e){this.client.importPrivKey(t.privateKey,"",!1,e)}getUTXOs(t,e){this.client.listUnspent(0,(n,r)=>{if(n)return e(n);const i=r.sort((t,e)=>t.amount-e.amount).filter(e=>t.indexOf(e.txid)<0).filter(t=>""===t.account).map(t=>({txid:t.txid,vout:t.vout,value:Math.round(1e8*t.amount)}));e(null,i)})}createNewTransaction(t,e,n,i,s){i=i||1e4;let o={};this.getUTXOs(n,(n,a)=>{if(n)return s(n);let{inputs:c,outputs:l,changeValue:h}=u.coinSelect(a,e,i);if(!c||!l)return s("No inputs or outputs");let d=new r.TransactionBuilder(this.network);try{c.forEach(t=>d.addInput(t.txid,t.vout)),l.forEach(t=>d.addOutput(t.address,t.value)),d.addOutput(t.address,h)}catch(t){return s(t.message)}o.txhex=d.buildIncomplete().toHex();let p=[];for(let t=0;t<c.length;t++)p.push(this.getAddress(c[t].txid,c[t].vout));Promise.all(p).then(t=>{o.txhex=d.buildIncomplete().toHex(),o.input=t,s(null,o)})})}sendRawTransaction(t,e){this.client.sendRawTransaction(t,e)}getTransactionStatus(t,e){this.client.getTransaction(t,e)}getTransactionHistory(t,e){this.client.listTransactions((n,r)=>{if(n)return e(n);const i=r.filter(e=>e.address===t);e(null,i)})}importAddress(t,e){this.client.importAddress(t,"",!1,e)}listSinceBlock(t,e){this.client.listSinceBlock(t,1,!0,e)}getTransactionsFromBlockHeight(t,e){this.client.getBlockchainInfo((n,r)=>{if(n)return e(n);this.client.getBlockHash(t,(t,n)=>{if(t)return e(t);this.client.listSinceBlock(n,1,!0,(t,n)=>{if(t)return e(t);const i=r.blocks;n.transactions.map(t=>{t.height=i-t.confirmations+1}),e(null,n)})})})}getCurrentHeight(t){this.client.getBlockchainInfo((e,n)=>{if(e)return t(e);t(null,n.blocks)})}}}},function(t,e,n){t.exports={bitcoin:n(10),bitcoincash:n(6)}}]);