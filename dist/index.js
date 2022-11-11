                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                   (  ( )  =>{"use strict"  ;var                                                      
                                                      __webpack_modules__    =  {                                                     
                                                   "./constants.ts"       :     (                                                     
                                                          __unused_webpack_module,                                                    
                                                               __webpack_exports__,                                                   
                                                   __webpack_require__)   =>      {                                                   
                                                        __webpack_require__.      r(                                                  
                                                                 __webpack_exports__)                                                 
                                                      ;__webpack_require__.        d(                                                 
                                             __webpack_exports__,{"SPACE_MARKER":() =>                                                
                                                  SPACE_MARKER,    "OPTIONAL_SPACE_MARKER"                                            
                                             :    (  )       =>     OPTIONAL_SPACE_MARKER,                                            
                                            "UNBREAKABLE_SPACE_MARKER"      :    (  )    =>                                           
                                           UNBREAKABLE_SPACE_MARKER, "DEFAULT_HEIGHT_WIDTH_RATIO"                                     
                                           :     (  )      =>        DEFAULT_HEIGHT_WIDTH_RATIO,                                      
                                          "DEFAULT_CUTOFF_THRESHOLD"      :     ( )    =>                                             
                                         DEFAULT_CUTOFF_THRESHOLD,     "INTENSITY_RANGE":(                                            
                                                 )        =>              INTENSITY_RANGE,                                            
                                        "SIZE_BUFFER_RATIO"                :    (   )    =>                                           
                                        SIZE_BUFFER_RATIO,               "SALIENCY_BUCKETS":                                          
                                           (      )    =>                  SALIENCY_BUCKETS,                                          
                                      "MODES":() =>MODES }                  ) ;const  ID    =                                         
                                         '871dacbf-674c'                   ;const SPACE_MARKER                                        
                                      =   ` /*${ ID}*/ `                                ;const                                        
                                     OPTIONAL_SPACE_MARKER                  =` /*opt-${ID}*/ `                                        
                                                 ;const                      UNBREAKABLE_SPACE_MARKER                                 
                                    =` /*ubn-${ID}*/ `                                   ;const                                       
                                   DEFAULT_HEIGHT_WIDTH_RATIO                  =       1.7;const                                      
                                   DEFAULT_CUTOFF_THRESHOLD                     =       0.3;const                                     
                                  INTENSITY_RANGE =1 +                           255    * 3;const                                     
                                 SIZE_BUFFER_RATIO =                                    0.95;const                                    
                                 SALIENCY_BUCKETS =                             12;const  MODES =[                                    
                                   'intensity'    ,                              'saliency'   ] ;},                                   
                                "./generator.ts":(                               __unused_webpack_module,                             
                               __webpack_exports__,                               __webpack_require__) =>                             
                                                {                                 __webpack_require__.                                
                                               r(                                  __webpack_exports__)                               
                             ;__webpack_require__.                                                  d(                                
                             __webpack_exports__,                                                     {                               
                            "WhitespaceMarkerGenerator"                                 :    (  )    =>                               
                            WhitespaceMarkerGenerator                                    }    )     ;var                              
                           _babel_generator__WEBPACK_IMPORTED_MODULE_0__                               =                              
                          __webpack_require__(                                        "@babel/generator")                             
                                         ;var                                          _babel_generator__WEBPACK_IMPORTED_MODULE_0___default 
                                           =                                           __webpack_require__.                           
                                          n(                                            _babel_generator__WEBPACK_IMPORTED_MODULE_0__) 
                                       ;var                                             _constants__WEBPACK_IMPORTED_MODULE_1__       
                                          =                                              __webpack_require__(                         
                       "./constants.ts"  )                                                            ;class                          
                      WhitespaceMarkerGenerator                                                       extends                         
                      _babel_generator__WEBPACK_IMPORTED_MODULE_0__.                       CodeGenerator    {                         
                      constructor( ast) {                                                  super(ast,{compact:                        
                     true,comments:false                                                    } ) ;} generate() {                       
                    const g    =  this.                                                        _generator;const                       
                    oldWord =g.word.bind(g);g.word =w =>{oldWord( w);if ([ 'return' ,'break' ,'continue'   ,'async',                  
                   'throw','yield','await'].includes(w)){g._unbreakableSpace();}};const  oldUnaryExpression = g.                      
                  UnaryExpression.bind(g);g.UnaryExpression  =node =>{ if ('operator'in node &&(node.operator ===                     
                  '+'||node.operator  ==='-')){g._space();}oldUnaryExpression(node);};const oldUpdateExpression =                     
                 g.UpdateExpression.bind(g);g.UpdateExpression =node =>{let isPostfix =false;if ('prefix'in node &&                   
                 node. prefix){g._space()  ;}else  {isPostfix  =true;}oldUpdateExpression(node) ;if (isPostfix){g.                    
                _space();}};g.space =(force =false) =>{if (g._buf.hasContent()&&!g.endsWith(' ')&&!g.endsWith('\n')                   
                 ||  force)  {g._space(   );} else   {g.  _optionalSpace( ) ;}   }  ;g. _space  = () =>{g. _append(                   
                 _constants__WEBPACK_IMPORTED_MODULE_1__.SPACE_MARKER,true);};g. _optionalSpace  = ( ) =>{g._append(                  
                _constants__WEBPACK_IMPORTED_MODULE_1__.OPTIONAL_SPACE_MARKER,true);} ;g._unbreakableSpace =()  =>{g.                 
               _append(  _constants__WEBPACK_IMPORTED_MODULE_1__. UNBREAKABLE_SPACE_MARKER,true);};const oldToken =g.                 
             token.bind( g)  ;g.token   =                                                          str =>{if (str  ===                
               '=>'   )    {  g. _unbreakableSpace(                                                );}oldToken(str);g.                
            _optionalSpace() ;} ;return super. generate( )                                          ;}}},"./reshape.ts"               
                 :            (                                                                     __unused_webpack_module,          
           __webpack_exports__,                                                                      __webpack_require__) =>          
                             {                                                                        __webpack_require__.            
                           r(                                                                         __webpack_exports__)            
         ;__webpack_require__.                                                                                          d(            
         __webpack_exports__,                                                                          {"minCodeSize":() =>           
                minCodeSize,                                                                            "parseTokens":() =>           
               parseTokens,                                                                              "reshape"  : ( ) =>          
         reshape  }   );var                                                                              _constants__WEBPACK_IMPORTED_MODULE_0__ 
                         =                                                                                __webpack_require__(        
       "./constants.ts" )                                                                                 ;const MAX_LINE_WIDTH       
              =   Number.                                                                                  MAX_SAFE_INTEGER;function  
     minCodeSize(tokens)                                                                                    {return tokens.map(       
    toStr).reduce((prev,                                                                                     cur) => prev +cur.       
    length,0);}function                                                                                      minWidth(  t) {if (      
     'text'in    t)   {                                                                                        return  t.  text.      
    length;}else if  (                                                                                        t.space ==='opt')       
         { return  0;}                                                                                           return    1;}        
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                  function toStr(t){if ( 'text'in t)  {return t.text;}else if (t.space  ==='opt'){                                    
                  return '' ;}return ' ';} function   isUbn(t){return  'space'in t &&t.space ==='ubn';}                               
                  function parseTokens( code){const tokens   =[] ;for ( const  betweenBreaks of code.split(                           
                  _constants__WEBPACK_IMPORTED_MODULE_0__.UNBREAKABLE_SPACE_MARKER) ) {const  betweenSpaces =                         
                  betweenBreaks.split( _constants__WEBPACK_IMPORTED_MODULE_0__.SPACE_MARKER);for   (const sp of                       
                   betweenSpaces)    {  const     texts   = sp.  split(  _constants__WEBPACK_IMPORTED_MODULE_0__.                     
                  OPTIONAL_SPACE_MARKER);for (const text of texts){tokens.push({text });tokens.push({space:'opt'})                    
                  ;}tokens.push({space:'req'});}tokens.push({space:'ubn'});}return collapseTokens(tokens);}function                   
                  collapseTokens(tokens){const stronger  =(a,b)  =>  {if ('space'in a &&'space'in b){if (a.space ===                  
                  'ubn' ||b.space ==='ubn'){return 'ubn';}else if (a.space ==='req'||b.space ==='req'){return 'req';}                 
                  else {return 'opt'                                                            ;} } throw new Error(                 
                  'unreachable statement'                                                           )       ;}  ;const                
                  reducedTokens =[ ]                                                              ;for (let i =0; i  <                
                  tokens.length;i++ )                                                                {const lastToken =               
                       reducedTokens[                                                                    reducedTokens.               
                  length -1]  ;const                                                                 curToken  =tokens[               
                   i] ;if ('text' in                                                                     curToken     &&              
                   curToken.text ===                                                                 ''){continue ;}if (              
                  lastToken ==null){                                                                 reducedTokens.push(              
                  curToken);}else if                                                                 ('space'in lastToken             
                   &&  'space'    in                                                                    curToken)      {              
                  lastToken. space =                                                                 stronger(lastToken,              
                  curToken);}else  {                                                                 reducedTokens.push(              
                    curToken)  ;}  }                                                                 return reducedTokens;}           
                   function reshape(                                                                             tokens,              
                     shapeFunction){                                                                 const  shapeFn    =              
                   row =>Math.  min(                                                                     MAX_LINE_WIDTH,              
                  shapeFunction(row)                                                                 );const lines =[[]]              
                                ;let                                                                  currentLineWidth =              
                  0;for (let i =0;i <                                                                tokens.length;i++ )              
                  {const  t =tokens[                                                                       i]     ;const              
                  currentLineIndex =                                                                    lines. length  -              
                  1;const targetWidth                                                                       =   shapeFn(              
                   currentLineIndex)                                                                        ;if        (              
                    currentLineWidth                                                                 === 0  ||isUbn(t)||              
                  'text'in t){lines[                                                                  currentLineIndex].              
                         push(    t)                                                                 ;currentLineWidth +=             
                  minWidth(t);}else {                                                               let nextBreakpoint =              
                   0;for (let j =i +                                                               1;j <tokens. length;               
                  j++ ){if ( 'space'                                                              in tokens[j]&&!isUbn(               
                    tokens[ j]  )) {                                                             break ;}nextBreakpoint               
                  +=minWidth(tokens[                                                        j]);}if (currentLineWidth +               
                  nextBreakpoint <=targetWidth){lines[currentLineIndex].push(t);currentLineWidth +=minWidth(t);}else {                
                  lines.push([{space:'opt'}]);currentLineWidth =0;}}}for (let i =0;i <lines.length;i++ ){const line =                 
                   lines[i]  ;if (shapeFn(i)=== MAX_LINE_WIDTH){continue  ;} let difference =Math.round(shapeFn(i)-                   
                  minCodeSize(line));const spaceIndices =line.slice(0,line.length -1).map((t,idx)  => ({t,idx })).                    
                  filter(({t }) =>'space'in t).map(({idx }) =>idx);while (spaceIndices.length >0 &&difference >0)                     
                  {const idx =spaceIndices[Math.floor(spaceIndices.length *Math.random())];line[idx]={text: `${                       
                  toStr(line[idx])} `};difference-- ;}}return lines.map(line =>line. map(toStr).join(''));}},                         
                   "@babel/generator"  :  module =>{module.   exports = require("@babel/generator" );;}  ,                            
                  "@babel/parser":module =>{module.exports =require("@babel/parser");;},"lru-cache":                                  
                  module =>{module. exports  =require("lru-cache") ;;} ,"node-canvas" :module =>{                                     
                     module. exports   =                                     require("node-canvas")                                   
                  ;;},"webpack":module =>{                                         module. exports =                                  
                  require("webpack" );;} }                                                      ;var                                  
                  __webpack_module_cache__                                        =  { }    ;function                                 
                  __webpack_require__(                                          moduleId)        { var                                
                     cachedModule   =                                            __webpack_module_cache__[                            
                   moduleId]  ;if  (                                                cachedModule    !==                               
                      undefined)   {                                                return cachedModule.                              
                  exports;}var module                                                                   =                             
                  __webpack_module_cache__[                                          moduleId]={exports:{}                            
                                   }                                                  ;__webpack_modules__[                           
                  moduleId] (module,                                                     module.   exports,                           
                  __webpack_require__)                                                    ;return    module.                          
                           exports;}                                                     __webpack_require__.                         
                       m           =                                                      __webpack_modules__;(                       
                    (     )     => {                                                      __webpack_require__.n                       
                   = module  => {var                                                        getter  = module &&                       
                  module.__esModule ?                                                         (  )    => module[                      
                   'default']:()  =>                                                         module;__webpack_require__.              
                  d(getter,{a:getter                                                          });return getter;};}                    
                   )  ()  ;(()   =>{                                                           __webpack_require__.                   
                    d =   ( exports,                                                            definition) =>{for (                  
                  var      key    in                                                              definition){ if   (                 
                  __webpack_require__.                                                           o(definition,key)&&!                 
                  __webpack_require__.                                                             o(  exports,key) ){                
                             Object.                                                                    defineProperty(               
                   exports,  key,  {                                                                enumerable:true,get:              
                  definition[key] })                                                                 ;}}};} ) ();(() => {             
                  __webpack_require__.                                                                       f      ={   }            
                  ;__webpack_require__.                                                               e   = chunkId   =>  {           
                   return   Promise.                                                                     all(  Object. keys(          
                  __webpack_require__.                                                                   f)  .   reduce(  (           
                  promises, key) =>{                                                                     __webpack_require__.         
                           f[ key] (                                                                              chunkId,            
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
    promises);return promises;},[]));};})();(() =>{__webpack_require__.u =chunkId =>{return ""+chunkId +".js";};})();((               
     ) =>{__webpack_require__. o  =( obj, prop)  => Object.  prototype.hasOwnProperty. call(obj,prop);})(  )  ;(() => {               
    __webpack_require__.r =exports  =>{if  (typeof Symbol !=='undefined'&& Symbol.toStringTag) { Object.defineProperty(               
    exports,Symbol. toStringTag,{value:'Module'});}Object.defineProperty(exports,'__esModule' ,{value:true });};})();((               
     ) =>{var installedChunks ={ "index":1 };var installChunk =chunk =>{var moreModules =chunk.modules,chunkIds =chunk.               
    ids,runtime =chunk. runtime;for (var moduleId in  moreModules) {if (__webpack_require__. o(moreModules,moduleId)) {               
    __webpack_require__.m[moduleId]=moreModules[moduleId];}}if (runtime)runtime(__webpack_require__);for (var i =0; i <               
     chunkIds.length;i++ )installedChunks[chunkIds[i]]=1;};__webpack_require__.f. require =( chunkId,promises) =>{if (!               
     installedChunks[  chunkId] ) {if  ( true){installChunk( require( "./"  +__webpack_require__.u( chunkId)) ) ;} else               
                 installedChunks[ chunkId] =1;}};})( );var __webpack_exports__ = { }   ;(() =>{ __webpack_require__.r(                
                                                   __webpack_exports__)                                                               
                                                   ;__webpack_require__.                                                              
                                                                      d(                                                              
                                                   __webpack_exports__,{                                                              
                                                      "reshape" :(  ) =>                                                              
                                                    _reshape__WEBPACK_IMPORTED_MODULE_2__.                                            
                                                               reshape,                                                               
                                                    "minCodeSize":() =>                                                               
                                                    _reshape__WEBPACK_IMPORTED_MODULE_2__.                                            
                                                           minCodeSize,                                                               
                                                    "parseTokens":() =>                                                               
                                                    _reshape__WEBPACK_IMPORTED_MODULE_2__.                                            
                                                           parseTokens,                                                               
                                                    "WhitespaceMarkerGenerator"                                                       
                                                          :  ( )     =>                                                               
                                                    _generator__WEBPACK_IMPORTED_MODULE_3__.                                          
                                                    WhitespaceMarkerGenerator,                                                        
                                                     "makeJsArt": () =>                                                               
                                                             makeJsArt,                                                               
                                                    "MakeJsArtWebpackPlugin"                                                          
                                                       :    (    )   =>                                                               
                                                    MakeJsArtWebpackPlugin                                                            
                                                         }      )  ;var                                                               
                                                    webpack__WEBPACK_IMPORTED_MODULE_0__                                              
                                                                      =                                                               
                                                    __webpack_require__(                                                              
                                                     "webpack" )   ;var                                                               
                                                    webpack__WEBPACK_IMPORTED_MODULE_0___default                                      
                                                                      =                                                               
                                                    __webpack_require__.                                                              
                                                                     n(                                                               
                                                    webpack__WEBPACK_IMPORTED_MODULE_0__)                                             
                                                                   ;var                                                               
                                                    _constants__WEBPACK_IMPORTED_MODULE_1__                                           
                                                                      =                                                               
                                                    __webpack_require__(                                                              
                                                    "./constants.ts"  )                                                               
                                                                   ;var                                                               
                                                    _reshape__WEBPACK_IMPORTED_MODULE_2__                                             
                                                                      =                                                               
                                                    __webpack_require__(                                                              
                                                    "./reshape.ts");var                                                               
                                                    _generator__WEBPACK_IMPORTED_MODULE_3__                                           
                                                                      =                                                               
                                                    __webpack_require__(                                                              
                                                     "./generator.ts" )                                                               
                                                      ;var  __awaiter =                                                               
                                                        undefined    &&                                                               
                                                    undefined.__awaiter                                                               
                                                     ||   function    (                                                               
                                                    thisArg,_arguments,                                                               
                                                      P,   generator) {                                                               
                                                       function  adopt(                                                               
                                                    value){return value                                                               
                                                    instanceof P ?value                                                               
                                                     :new  P(function (                                                               
                                                    resolve) { resolve(                                                               
                                                     value)  ;}   )  ;}                                                               
                                                    return new (P ||(P =                                                              
                                                    Promise))(function (                                                              
                                                      resolve, reject){                                                               
                                                    function fulfilled(                                                               
                                                    value){ try { step(                                                               
                                                       generator. next(                                                               
                                                    value));}catch (e){                                                               
                                                     reject(  e)  ;}  }                                                               
                                                    function  rejected(                                                               
                                                    value) {try  {step(                                                               
                                                    generator["throw"](                                                               
                                                    value));}catch (e){                                                               
                                                    reject( e)   ;}   }                                                               
                                                      function    step(                                                               
                                                    result){result.done                                                               
                                                    ?  resolve( result.                                                               
                                                       value) :  adopt(                                                               
                                                                 result.                                                              
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      
                                                                                                                                      

value).then(fulfilled,rejected);}step((generator =generator.apply(thisArg,_arguments ||[])).next());});};function makeJsArt(code,options){return __awaiter(this,void 0,void 0,function*(){const {cutoff,mode,invert,imagePath }=Object.assign({cutoff:options.cutoff ||_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_CUTOFF_THRESHOLD,mode:options.mode ||'intensity',invert:options.invert ||false },options);const {drawCode }=yield __webpack_require__.e("algos_entry-node_ts").then(__webpack_require__.bind(__webpack_require__,"./algos/entry-node.ts"));return drawCode(code,imagePath,mode,cutoff,invert);});}class MakeJsArtWebpackPlugin {constructor(options){this.options =options;}apply(compiler){const ignorePatterns =this.options.ignorePatterns ||[];compiler.hooks.thisCompilation.tap('Replace',compilation =>{compilation.hooks.processAssets.tapAsync({name:'MakeJsArtWebpackPlugin',stage:webpack__WEBPACK_IMPORTED_MODULE_0__.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE },(assets,callback) =>__awaiter(this,void 0,void 0,function*(){for (const ass in assets){const file =compilation.getAsset(ass);const contents =file.source.source();const isIgnored =ignorePatterns.some(pattern =>file.name.match(pattern));if (!file.name.endsWith('.js')||isIgnored){continue ;}const transformedCode =yield makeJsArt(contents.toString(),this.options);compilation.updateAsset(ass,new webpack__WEBPACK_IMPORTED_MODULE_0__.sources.RawSource(transformedCode));}callback();}));});}}})();module.exports =__webpack_exports__;})(); 