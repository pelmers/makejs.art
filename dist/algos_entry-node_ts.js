                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                               exports. id  =  "algos_entry-node_ts"                                                                  
                                                              ;exports.ids =["algos_entry-node_ts" ]                                                                  
                                                                 ;exports.       modules       =    {                                                                 
                                                             "./vendor/IsThisColourSimilar/Colour.js"                                                                 
                                                                  :       (   __unused_webpack_module,                                                                
                                                                                  __webpack_exports__,                                                                
                                                              __webpack_require__)   =>   {"use strict"                                                               
                                                             ;__webpack_require__.r(__webpack_exports__)                                                              
                                                            ;__webpack_require__.d(__webpack_exports__, {                                                             
                                                          "Colour" :() => Colour });class Colour { static                                                             
                                                         hex2lab(hex){const [r,g,b,a]=Colour.hex2rgba(hex)                                                            
                                                           ;const [ x,y,   z]=Colour.   rgb2xyz(r,g,  b,a)                                                            
                                                        ;return Colour.xyz2lab(    x,y,z);}static rgba2lab(                                                           
                                                       r,g,b,a =1){const [x,y,      z]=Colour.rgb2xyz(r,g,b,                                                          
                                                        a)   ;return   Colour.      xyz2lab( x, y,z);}static                                                          
                                                      lab2rgba(l,a,b){const [     x,y,z] =Colour.lab2xyz(l,a,                                                         
                                                      b)   ;return   Colour.      xyz2rgba( x,y,z);}static hex2rgba(                                                  
                                                     hex){ let c;if (   hex.    charAt(   0)  === "#" ){ c =hex.                                                      
                                                    substring(1) .split('')   ;}if     (c.length >6 ||c.length                                                        
                                                    <  3)    {throw new Error(         `HEX colour must be 3 or 6 values. You provided it ${                          
                                                   c. length}`);} if  ( c.              length ===3){c =[c[0],c[                                                      
                                                   0],c[1],c[1],c[2],c[2]]               ;}c  ="0x"  +c.join("")                                                      
                                                  ;let r =c >>16 &255;let  g              =c >>8 &255;let b =c  &                                                     
                                                  255;let a =1;return [r,                 g,b,a];}static rgb2xyz(                                                     
                                                 r,g,b,a =1){if (r >255)                   {r =255;}else if (r <0)                                                    
                                                {r  =0;}if (g >255){g =                    255;}else if (g <0){g =                                                    
                                                0;}if (b >255){b =255;}                     else if (b <0){b =0;}if                                                   
                                               (a >1){a =1;}else if (a                       <0){a =0;}r =r /255;g =                                                  
                                               g /255;b =b /255;if (r >                      0.04045){r =Math.pow((r                                                  
                                              +0.055) /1.055,2.4)  ;}                         else {r =r /12.92;}if (                                                 
                                             g >0.04045){g =Math.pow(                         (g +0.055)/1.055,2.4);}                                                 
                                             else {g =g /12.92;}if (                           b >0.04045){ b =  Math.                                                
                                            pow((b +0.055)/  1.055,                             2.4);}else  { b = b  /                                                
                                            12.92;}r =r *100;g =g *                             100;b =b *100;const x =                                               
                                           r  * 0.4124564   +  g *                                0.3575761    +   b  *                                               
                                           0.1804375;const y =r  *                               0.2126729 +g *0.7151522                                              
                                          +b *0.0721750;const z =                                  r * 0.0193339   +  g *                                             
                                           0.1191920   +   b    *                                 0.9503041;return [x, y,                                             
                                         z];} static xyz2rgba(x,                                   y,z){ let varX  = x   /                                            
                                        100;let    varY  =  y /                                      100;let varZ =  z   /                                            
                                        100;let varR  = varX  *                                       3.2404542  + varY * -                                           
                                        1.5371385  + varZ  * -                                       0.4985314;let   varG =                                           
                                      varX * -0.9692660 +varY *                                        1.8760108  + varZ   *                                          
                                        0.0415560;let  varB =                                         varX *0.0556434 +varY *                                         
                                       -  0.2040259   +varZ *                                          1.0572252;if (  varR >                                         
                                     0.0031308){varR =1.055 *                                          Math.pow( varR,1 /2.4)-                                        
                                    0.055;} else  {varR   =                                            12.92 *varR;}if (varG >                                        
                                   0.0031308){varG =1.055 *                                              Math.pow(varG,1 /2.4)-                                       
                                   0.055;}  else { varG  =                                              12.92 *varG;}if (varB >                                       
                                  0.0031308){varB =1.055 *                                               Math. pow(varB,1 /2.4)-                                      
                                  0.055;}else {varB =12.92                                                 * varB;}let   r =Math.                                     
                                 round(varR *255);let g =                                                  Math.round(varG * 255)                                     
                                 ;let b =Math.round(varB                                                   *255);return  [r,g,b,1]                                    
                                ;}static xyz2lab(x,y,z){                                                     const   referenceX   =                                   
                               94.811;const referenceY =                                                    100;const  referenceZ =                                   
                                  107.304;x     = x  /                                                        referenceX;y   =   y /                                  
                              referenceY;z    =   z  /                                                        referenceZ;if    (x  >                                  
                              0.008856){x =Math.pow(x,                                                        1 /3);}else {x =7.787 *                                 
                             x + 16 /116;}if  ( y   >                                                          0.008856){y =Math.pow(                                 
                             y,1 /3);}else {y =7.787 *                                                          y  + 16 /116;} if (z >                                
                            0.008856){z =Math.pow(z,                                                           1 /3);}else {z =7.787 *z                               
                           +16 /116;}const l =116 *y                                                            -16;const a =500 *( x -                               
                           y);const b =200 *(y -z)                                                              ;return [l,a, b];}static                              
                           lab2xyz(l, a, b) {const                                                                   referenceX        =                              
                          94.811;const referenceY =                                                               100;const  referenceZ =                             
                         107.304;let varY =( l  +                                                                  16)/116;let varX =a  /                             
                         500 +varY;let varZ =varY                                                                  -b /200;if (  Math.pow(                            
                        varY,3)>0.008856){varY =Math.pow( varY,3);}else {varY =(varY -16 /116)/7.787;}if (Math.pow(varX,3)>0.008856){varX =                           
                        Math.pow(varX,3);}else { varX =(varX -16 /116)/7.787;}if (Math.pow(varZ,3)>0.008856){varZ =Math.pow(varZ,3);}else {                           
                       varZ =(varZ -16 /116)/7.787;}let x =varX *referenceX;let y =varY *referenceY;let z =varZ *referenceZ;return [x,y,z];}                          
                      static deltaE00(l1,a1,b1,l2,a2,b2){Math.rad2deg =function (rad){return 360 *rad /(2 *Math.PI);};Math.deg2rad =function                          
                      (deg){return 2 *Math.PI *deg /360;};const avgL =(l1 +l2)/2;const c1 =Math.sqrt(Math.pow(a1,2)+Math.pow(b1,2));const c2 =                        
                     Math. sqrt(Math.pow(a2,2)+Math.pow(b2,2));const avgC =(c1 +c2)/2;const g =(1 -Math.sqrt(Math.pow(avgC,7)/(Math.pow(avgC,                         
                     7)+Math.pow(25,7))))/2;const a1p =a1 *(1  +g);const a2p =a2 *(1 +g);const c1p =Math.sqrt(Math.pow(a1p, 2)+Math.pow(b1,2))                        
                    ;const c2p =Math.sqrt(Math.pow(a2p,2)+Math.pow(b2,2));const avgCp =( c1p +c2p)/2;let h1p  =Math.rad2deg(Math.atan2(b1,a1p))                       
                    ;if (h1p <0){h1p =h1p +360;}let h2p =Math.rad2deg(Math.atan2(b2,a2p));if (h2p <0){h2p =h2p +360;}const avghp =Math.abs(h1p -                      
                   h2p)>180 ?(h1p +h2p +360)/2 :(h1p +h2p)/2;const t =1 -0.17 *Math.cos(Math.deg2rad(avghp -30))+0.24 *Math.cos(Math.deg2rad(2 *                      
                  avghp))+0.32 *Math.cos(Math. deg2rad(3 *avghp  +6))-0.2 *Math.cos(Math.deg2rad(4 *avghp -63));let deltahp = h2p -h1p;if (Math.                      
                  abs(deltahp)>180){if (h2p <=h1p){deltahp +=360;}else {deltahp -=360;}}const deltalp =l2 -l1;const deltacp =c2p -c1p;deltahp =2 *                    
                 Math.sqrt( c1p *c2p)*Math.sin(Math.deg2rad(deltahp)/2);const sl =1 +0.015 *Math.pow(avgL -50,2)/Math.sqrt(20 +Math.pow(avgL -50,                     
                 2));const sc =1 +0.045 *avgCp;const sh                                                                  =1 +0.015 *avgCp *t;const                    
                deltaro =30 *Math.exp( -Math.pow((avghp -                                                                 275)/25,2));const rc =2 *                   
                Math.sqrt(Math.pow(avgCp,  7)/ (Math. pow(                                                                avgCp,7)+Math.pow(25,7)))                   
               ;const rt  = -rc *Math.sin(2 *Math.                                                                          deg2rad(deltaro)) ;const                  
              kl  =1;const kc   =1;const  kh  =                                                                             1;const  deltaE  = Math.                  
              sqrt(Math.pow(deltalp /(  kl *                                                                                 sl),2)+Math.pow(deltacp /                
              ( kc *sc), 2)+Math.pow( deltahp                                                                                 /(kh  *sh)  ,2)+ rt  *(                 
             deltacp  / (kc *sc) ) *( deltahp                                                                                    /    (kh *    sh))  )                
             ;return  deltaE;}static                                                                                           getDarkerColour(r,g,b,a =              
             1,  darkenPercentage  =                                                                                            0.05) {let [l1,a1, b1]=               
           Colour.rgba2lab(r,g,b,a)                                                                                               ;l1     -=  l1       *              
          darkenPercentage;if (l1 <                                                                                                  0)   {  l1   =  0;}              
          return Colour.lab2rgba(                                                                                                 l1,   a1, b1)  ;}static             
         getBrighterColour(r,g,b,                                                                                                 a =1,brighterPercentage             
         =0.05){let [  l1,a1,b1]=                                                                                                 Colour.rgba2lab(r,g,b,a)            
            ;l1   += l1        *                                                                                                   brighterPercentage;if  (           
        l1 >   100){ l1 =  100;}                                                                                                    return Colour.lab2rgba(           
         l1, a1,    b1) ;}} } ,                                                                                                     "./algos/common.ts"   :(          
       __unused_webpack_module,                                                                                                         __webpack_exports__,          
      __webpack_require__) =>                                                                                                               {    "use strict"         
      ;__webpack_require__.r(                                                                                                            __webpack_exports__)         
      ;__webpack_require__.d(                                                                                                            __webpack_exports__,{        
     "modeDescription":() =>                                                                                                                  modeDescription,        
    "extractRunsByCutoff": (                                                                                                           ) =>extractRunsByCutoff        
        }      )  ;function                                                                                                             modeDescription(mode)         
       {return { intensity:                                                                                                              'Intensity (faster)'         
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                       ,saliency:'Saliency (slower)'}[ mode];}function extractRunsByCutoff(width,  height,passesCutoff){                                              
                      const runs =[];for (let row =0;row <height;row++ ){for (let col =0;col <width;col++ ){const i =row *width                                       
                      +col;if (passesCutoff( row,col)){if (runs. length >0 && col >0  && runs[runs.length -1][runs[runs.length -1].                                   
                      length -1]===i -1){runs[runs.length -1].push(i);}else {runs.push([i]);}}}}return runs;}},"./algos/drawCode.ts":                                 
                        (__unused_webpack_module,__webpack_exports__,__webpack_require__)   =>  {  "use strict";__webpack_require__.  r(                              
                      __webpack_exports__) ;__webpack_require__.  d( __webpack_exports__,{ "drawCodeCommon":( )  =>drawCodeCommon }) ;var                             
                               _babel_parser__WEBPACK_IMPORTED_MODULE_0__        =     __webpack_require__(     "@babel/parser"    )   ;var                           
                      _babel_parser__WEBPACK_IMPORTED_MODULE_0___default =  __webpack_require__.n(_babel_parser__WEBPACK_IMPORTED_MODULE_0__)                         
                            ;var   _constants__WEBPACK_IMPORTED_MODULE_1__       =  __webpack_require__(       "./constants.ts"       )   ;var                        
                      _generator__WEBPACK_IMPORTED_MODULE_2__ =__webpack_require__("./generator.ts");var _reshape__WEBPACK_IMPORTED_MODULE_3__ =                      
                           __webpack_require__(  "./reshape.ts"     )   ;var    _intensity__WEBPACK_IMPORTED_MODULE_4__  =  __webpack_require__(                      
                      "./algos/intensity.ts"  )  ;var  _saliency__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(  "./algos/saliency.ts");var                      
                      __awaiter =undefined &&                                                                      undefined.__awaiter ||function                     
                      (thisArg, _arguments,P,                                                                         generator)  {function adopt(                    
                          value){return value                                                                           instanceof P ?value :new P(                   
                      function (resolve){resolve(          value)                                                        ;});}return new  (P ||(P =                   
                      Promise))(function ( resolve,                                                                        reject)    {    function                   
                      fulfilled(value){try {step(                                                                           generator.next(value));}                  
                      catch  (e){reject( e) ;}}                                                                             function rejected(value)                  
                      { try { step(  generator[                                                                              "throw"](value));}catch                  
                      (e){reject(e);}}function                                                                                step(result){  result.                  
                       done ?resolve( result.                                                                                 value) : adopt(result.                  
                       value).then(fulfilled,                                                                                    rejected);}  step((                  
                      generator  = generator.                                                                                     apply(    thisArg,                  
                      _arguments ||[])).next(                                                                                ) ) ;} ) ;}   ;function                  
                       drawCodeCommon(  code,                                                                                  imageFileUri,   mode,                  
                             cutoff,  invert,                                                                                loadImageToCanvas)    {                  
                      return __awaiter( this,                                                                                void 0,void 0,function*                  
                      ( ){const genCode  =new                                                                                 _generator__WEBPACK_IMPORTED_MODULE_2__. 
                      WhitespaceMarkerGenerator(                                                                                     (            0,                  
                      _babel_parser__WEBPACK_IMPORTED_MODULE_0__.                                                               parse)  ( code)  ) .                  
                      generate( ). code;const                                                                                   tokens     =   (  0,                  
                      _reshape__WEBPACK_IMPORTED_MODULE_3__.                                                                   parseTokens)(genCode)                  
                      ;if (invert){cutoff =1 -                                                                                    cutoff;}     const                  
                       targetSize  =   (   0,                                                                                 _reshape__WEBPACK_IMPORTED_MODULE_3__.  
                      minCodeSize) ( tokens)*                                                                                 _constants__WEBPACK_IMPORTED_MODULE_1__. 
                         SIZE_BUFFER_RATIO  /                                                                                 cutoff;const { canvas,                  
                        ctx      }          =                                                                                 yield loadImageToCanvas(                
                                imageFileUri,                                                                                 targetSize);const runs                  
                      =mode ==='saliency'?(0,                                                                                 _saliency__WEBPACK_IMPORTED_MODULE_5__. 
                      findRegionsBySaliency)(                                                                                  canvas, ctx,  cutoff,                  
                          invert)    :  (  0,                                                                                 _intensity__WEBPACK_IMPORTED_MODULE_4__. 
                      findRegionsByIntensity)                                                                                 ( canvas,ctx,  cutoff,                  
                      invert);const shapeFn =                                                                                i  => i  <runs.length ?                  
                      runs[i].length :Number.                                                                                 MAX_SAFE_INTEGER;const                  
                      codeSegments     = ( 0,                                                                                _reshape__WEBPACK_IMPORTED_MODULE_3__.   
                        reshape)  (   tokens,                                                                                shapeFn)     ;if      (                  
                       codeSegments. length >                                                                               runs.   length  + 1)   {                  
                         throw    new  Error(                                                                              `Unexpected segment length of ${           
                                codeSegments.                                                                               length} from ${   runs.                   
                      length} runs`);}while (                                                                           codeSegments.length < runs.                   
                        length)      {  const                                                                         nextRunLength     =    runs[                    
                       codeSegments. length] .length;if (nextRunLength  >5){ codeSegments. push(`/*${'o'.repeat(nextRunLength -  4)}*/` );} else {                    
                      codeSegments.push(' '.repeat( nextRunLength));}}let result ='';let runIndex =0;for (let row =0;row <canvas.height;row++ ){                      
                      for (let col =0;col <canvas.width;col++ ){const i =row *canvas.width  +col;if (runIndex <runs.length &&i >=runs[runIndex][                      
                      0]){result +=codeSegments[runIndex] +' ';col +=codeSegments[runIndex].length;runIndex++ ;}else {result +=' ';}}result +=                        
                        '\n';} for (let   i =  runIndex;i <codeSegments.length;  i++ ){result +=`\n${codeSegments[i]}`;}return result;} ) ;}},                        
                        "./algos/entry-node.ts"  : (  __unused_webpack_module,  __webpack_exports__, __webpack_require__)  => { "use strict"                          
                      ;__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"drawCode" :() => drawCode } )  ;var                     
                         node_canvas__WEBPACK_IMPORTED_MODULE_0__        =      __webpack_require__(    "node-canvas"          )    ;var                              
                              node_canvas__WEBPACK_IMPORTED_MODULE_0___default             =            __webpack_require__.        n(                                
                      node_canvas__WEBPACK_IMPORTED_MODULE_0__)  ;var _constants__WEBPACK_IMPORTED_MODULE_1__ =__webpack_require__(                                   
                      "./constants.ts");var _drawCode__WEBPACK_IMPORTED_MODULE_2__ =__webpack_require__("./algos/drawCode.ts"                                         
                       );var  __awaiter =undefined &&undefined.__awaiter ||function ( thisArg,_arguments, P,generator) {                                              
                       function adopt(value){return value instanceof P ?value :new P(function (resolve){resolve(value);})                                             
                       ;}return  new (P  || ( P  =                                              Promise) )  (  function  (                                            
                       resolve,  reject)  {    function                                         fulfilled(value){try { step(                                          
                      generator.next(value));}catch (e){                                           reject(  e) ;} }  function                                         
                       rejected(  value){try { step(                                              generator["throw"] (value))                                         
                       ;}catch  (  e) {reject(e);} }                                                function     step(result){                                        
                        result. done  ? resolve(                                                      result.   value) :adopt(                                        
                      result. value).     then(                                                      fulfilled,rejected);}step(                                       
                      (generator = generator.                                                          apply(thisArg,_arguments                                       
                       ||[])). next() );} ) ;}                                                                         ;function                                      
                           loadImageToCanvas(                                                           imageFilePath,targetSize)                                     
                      {return __awaiter(this,                                                            void 0,void 0,function*()                                    
                      {const image =yield (0,                                                             node_canvas__WEBPACK_IMPORTED_MODULE_0__.                   
                            loadImage)      (                                                              imageFilePath);const ratio                                 
                      =Math.sqrt(targetSize /                                                               (   image.width  *image.                                  
                           height) )   ;const                                                                targetWidth =Math.round(                                 
                       image.width   *ratio *                                                                       Math.        sqrt(                                
                      _constants__WEBPACK_IMPORTED_MODULE_1__.                                                DEFAULT_HEIGHT_WIDTH_RATIO)                             
                      );const targetHeight  =                                                                  Math.round(image.height *                              
                       ratio     /Math. sqrt(                                                                   _constants__WEBPACK_IMPORTED_MODULE_1__.              
                      DEFAULT_HEIGHT_WIDTH_RATIO)                                                                ) ;const   target   = (0,                            
                      node_canvas__WEBPACK_IMPORTED_MODULE_0__.                                                  createCanvas)(targetWidth,                           
                      targetHeight);const ctx                                                                      =target.getContext('2d')                           
                      ;ctx.drawImage(image,0,                                                                      0, target. width, target.                          
                      height);return {canvas:                                                                        target, ctx:ctx };}  );}                         
                      function drawCode(code,                                                                        imageFileUri,mode,cutoff,                        
                             invert)        {                                                                         return __awaiter(   this,                       
                      void 0,void 0,function*                                                                            ( )   {   return   ( 0,                      
                      _drawCode__WEBPACK_IMPORTED_MODULE_2__.                                                             drawCodeCommon) ( code,                     
                          imageFileUri, mode,                                                                                 cutoff,     invert,                     
                      loadImageToCanvas);});}                                                                            },"./algos/intensity.ts":                    
                                            (                                                                              __unused_webpack_module,                   
                         __webpack_exports__,                                                                              __webpack_require__)  =>{                  
                                 "use strict"                                                                               ;__webpack_require__.  r(                 
                         __webpack_exports__)                                                                                 ;__webpack_require__. d(                
                      __webpack_exports__,  {                                                                                "findRegionsByIntensity":(               
                             )             =>                                                                                 findRegionsByIntensity  })              
                                         ;var                                                                                  _constants__WEBPACK_IMPORTED_MODULE_0__ 
                       = __webpack_require__(                                                                                    "./constants.ts"   );var             
                      _common__WEBPACK_IMPORTED_MODULE_1__                                                                         = __webpack_require__(             
                       "./algos/common.ts"  )                                                                                                  ;function              
                      findRegionsByIntensity(                                                                                         canvas,      ctx,               
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
       cutoffRatio,     invert) {  const data   =    ctx. getImageData(0, 0,   canvas.width,  canvas.  height)  ;const histogram    =  new   Array(                   
     _constants__WEBPACK_IMPORTED_MODULE_0__.INTENSITY_RANGE).fill(0);for (let i =0;i <data.data.length;i +=4){const [r,g,b,a]=data.data.slice(i,i +                  
     4);const intensity =Math.round(a /255 *(r +g +b));histogram[intensity]++ ;}const cutoff =data.width *data.height *cutoffRatio;let accum =0;let                   
      cutoffValue =histogram. length - 1;if  (invert){histogram.reverse() ;}while ( accum < cutoff &&cutoffValue >0){accum +=histogram[ cutoffValue]                  
     ;cutoffValue-- ;}if (invert){cutoffValue =histogram.length -1 -cutoffValue;}return (0,_common__WEBPACK_IMPORTED_MODULE_1__.extractRunsByCutoff)                  
     (data.width,data.height,(row,col) =>{const i =row *data.width +col;const [r,g,b,a]=data.data.slice(i *4,(i +1)*4);const intensity =Math.round(a                  
     /   255 *(r +g +b)) ;return invert ?  intensity <=cutoffValue :intensity  >=cutoffValue;});}} ,"./algos/saliency.ts":( __unused_webpack_module,                  
     __webpack_exports__,__webpack_require__) =>{"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{                  
     "findRegionsBySaliency" :() =>findRegionsBySaliency } );var _constants__WEBPACK_IMPORTED_MODULE_0__ =__webpack_require__("./constants.ts" );var                  
            _common__WEBPACK_IMPORTED_MODULE_1__            =             __webpack_require__(           "./algos/common.ts"         )          ;var                  
     _vendor_IsThisColourSimilar_Colour__WEBPACK_IMPORTED_MODULE_2__  =    __webpack_require__( "./vendor/IsThisColourSimilar/Colour.js"   )    ;var                  
        lru_cache__WEBPACK_IMPORTED_MODULE_3__    =  __webpack_require__(  "lru-cache"  );var    lru_cache__WEBPACK_IMPORTED_MODULE_3___default    =                  
                                                                 __webpack_require__. n(                                                                              
                                                                lru_cache__WEBPACK_IMPORTED_MODULE_3__)                                                               
                                                                ;const HISTOGRAM_THRESHOLD                                                                            
                                                               =0.95;const bucketSize =256 /                                                                          
                                                                _constants__WEBPACK_IMPORTED_MODULE_0__.                                                              
                                                                     SALIENCY_BUCKETS;const                                                                           
                                                                 toBucket  = value =>Math.                                                                            
                                                                floor( value /bucketSize)                                                                             
                                                                ;const colorToIndex =(r,                                                                              
                                                                  g,b)  => toBucket(r) *                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                  SALIENCY_BUCKETS     *                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                      SALIENCY_BUCKETS +                                                                              
                                                                  toBucket(     g)     *                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                    SALIENCY_BUCKETS   +                                                                              
                                                                   toBucket(  b)  ;const                                                                              
                                                                 indexToColor =new Array(                                                                             
                                                                        Math.       pow(                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                 SALIENCY_BUCKETS,3) ) .                                                                              
                                                                 fill(0).map((_,idx) =>{                                                                              
                                                                 const  rIndex   = Math.                                                                              
                                                                    floor(   idx  /    (                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                  SALIENCY_BUCKETS     *                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                  SALIENCY_BUCKETS)    )                                                                              
                                                                  ;const  gIndex = Math.                                                                              
                                                                  floor(( idx  -rIndex)/                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                 SALIENCY_BUCKETS);const                                                                              
                                                                 bIndex  = idx -rIndex -                                                                              
                                                                 gIndex;return [(rIndex +                                                                             
                                                                 0.5)*bucketSize,(gIndex                                                                              
                                                                    + 0.5) *bucketSize,(                                                                              
                                                                   bIndex       + 0.5) *                                                                              
                                                                  bucketSize];} ) ;const                                                                              
                                                                    rgbCache  = new    (                                                                              
                                                                 lru_cache__WEBPACK_IMPORTED_MODULE_3___default(                                                      
                                                                 ))({max:2 * Math.  pow(                                                                              
                                                                 _constants__WEBPACK_IMPORTED_MODULE_0__.                                                             
                                                                 SALIENCY_BUCKETS,3) } )                                                                              
                                                                 ;function rgb2lab( r,g,                                                                              
                                                                 b){ const key =[r,g,b].                                                                              
                                                                 join( ' ' );const res =                                                                              
                                                                 rgbCache. get(key);if (                                                                              
                                                                    res      !=  null) {                                                                              
                                                                 return res;}else {const                                                                              
                                                                             lab       =                                                                              
                                                                 _vendor_IsThisColourSimilar_Colour__WEBPACK_IMPORTED_MODULE_2__.                                     
                                                                 Colour.rgba2lab(r,g, b)                                                                              
                                                                  ;rgbCache.set(key,lab)                                                                              
                                                                 ;return lab;}}const diff                                                                             
                                                                 = (r1, g1, blu1, r2,g2,                                                                              
                                                                 blu2) =>{const  [l1,a1,                                                                              
                                                                 b1]=rgb2lab(r1,g1,blu1)                                                                              
                                                                    ;const  [ l2,a2,b2]=                                                                              
                                                                  rgb2lab(  r2,g2, blu2)                                                                              
                                                                 ;return _vendor_IsThisColourSimilar_Colour__WEBPACK_IMPORTED_MODULE_2__.                             
                                                                 Colour.deltaE00( l1,a1,                                                                              
                                                                  b1,l2, a2, b2);};class                                                                              
                                                                  CompressedHistogram  {                                                                              
                                                                 constructor(histogram){                                                                              
                                                                  this. compressed  =[ ]                                                                              
                                                                                  ;this.                                                                              
                                                                 originalToCompressedMap                                                                              
                                                                 =new Map();const total =                                                                             
                                                                 histogram.reduce((prev,                                                                              
                                                                 cur) =>prev +   cur, 0)                                                                              
                                                                  ;const  target  =Math.                                                                              
                                                                   round(     total    *                                                                              
                                                                    HISTOGRAM_THRESHOLD)                                                                              
                                                                     ;const     sorted =                                                                              
                                                                  histogram.   map(  (v,                                                                              
                                                                  idx) =>( {v, idx  })).                                                                              
                                                                 sort((a,b) =>b.v - a.v)                                                                              
                                                                 ;let i,accum;for (i =0,                                                                              
                                                                  accum  =0; i < sorted.                                                                              
                                                                 length &&accum <target;                                                                              
                                                                 i++ ){const  {v, idx }=                                                                              
                                                                   sorted[i]   ;accum +=                                                                              
                                                                 v;this.compressed.push(                                                                              
                                                                   { originalIndex: idx,                                                                              
                                                                   count:  v   }) ;this.                                                                              
                                                                 originalToCompressedMap.                                                                             
                                                                   set(   idx,     this.                                                                              
                                                                 compressed.length -1);}                                                                              
                                                                 for (;i <sorted.length;                                                                              
                                                                 i++ ){ const {v,idx } =                                                                              
                                                                 sorted[i];const [r1,g1,                                                                              
                                                                 blu1]=indexToColor[idx]                                                                              
                                                                  ;const [l1, a1,  b1] =                                                                              
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      
                                                                                                                                                                      

rgb2lab(r1,g1,blu1);let smallestDelta =Number.MAX_SAFE_INTEGER;let smallestDeltaIdx =0;for (const {delta,idx }of this.compressed.map(({originalIndex },idx) =>{const [r2,g2,blu2]=indexToColor[originalIndex];const [l2,a2,b2]=rgb2lab(r2,g2,blu2);return {delta:_vendor_IsThisColourSimilar_Colour__WEBPACK_IMPORTED_MODULE_2__.Colour.deltaE00(l1,a1,b1,l2,a2,b2),idx };})){if (delta <smallestDelta){smallestDelta =delta;smallestDeltaIdx =idx;}}this.compressed[smallestDeltaIdx].count +=v;this.originalToCompressedMap.set(idx,smallestDeltaIdx);}}saliency(r,g,b){const pixelIndex =colorToIndex(r,g,b);const compressedPixelIndex =this.originalToCompressedMap.get(pixelIndex);return this.compressed.reduce((prev,cur,idx) =>{if (idx ===compressedPixelIndex){return prev;}else {const [rh,gh,bh]=indexToColor[cur.originalIndex];return prev +cur.count *diff(r,g,b,rh,gh,bh);}},0);}}function findRegionsBySaliency(canvas,ctx,cutoffRatio,invert){const data =ctx.getImageData(0,0,canvas.width,canvas.height);const colorHistogram =new Array(Math.pow(_constants__WEBPACK_IMPORTED_MODULE_0__.SALIENCY_BUCKETS,3)).fill(0);for (let i =0;i <data.data.length;i +=4){const [r,g,b]=data.data.slice(i,i +3);colorHistogram[colorToIndex(r,g,b)]++ ;}const histogram =new CompressedHistogram(colorHistogram);const perPixelSaliency =new Array(canvas.width *canvas.height);for (let i =0;i <data.data.length;i +=4){const [r,g,b]=data.data.slice(i,i +3);perPixelSaliency[i /4]=histogram.saliency(r,g,b);}const sortedPixels =perPixelSaliency.concat().sort((a,b) =>invert ?a -b :b -a);const cutoffValue =sortedPixels[Math.round(cutoffRatio *sortedPixels.length)];return (0,_common__WEBPACK_IMPORTED_MODULE_1__.extractRunsByCutoff)(data.width,data.height,(row,col) =>{const i =row *data.width +col;return invert ?perPixelSaliency[i]<=cutoffValue :perPixelSaliency[i]>=cutoffValue;});}}};; 