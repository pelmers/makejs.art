                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                              (self[  "webpackChunk"    ]   = self[                                                                  
                                                             "webpackChunk"]||[]).push([[487],{6487:                                                                 
                                                                      (     __unused_webpack_module,                                                                 
                                                                                 __webpack_exports__,                                                                
                                                            __webpack_require__)  =>    {"use strict"                                                                
                                                           ;__webpack_require__.r(__webpack_exports__)                                                               
                                                           ;__webpack_require__.d(__webpack_exports__,{                                                              
                                                          "drawCode":()  =>drawCode  });var constants =                                                              
                                                          __webpack_require__(   1742)   ;var    lib   =                                                             
                                                         __webpack_require__( 3883);var  generator_lib =                                                             
                                                               __webpack_require__(     1217)     ;;class                                                            
                                                        WhitespaceMarkerGenerator extends generator_lib.pi                                                           
                                                        {  constructor(ast)  {     super(   ast, {compact:                                                           
                                                       true,comments:false })       ;}generate(){ const g =                                                          
                                                       this. _generator;const       oldWord =g.word.bind(g)                                                          
                                                     ;g.word = w =>{oldWord(           w) ;if  ( ['return' ,                                                         
                                                      'break'   ,'continue',      'async'  ,'throw',   'yield'  ,                                                    
                                                    'await'].includes(w)){g.         _unbreakableSpace()  ;}}                                                        
                                                                     ;const   oldUnaryExpression  =   g.UnaryExpression.                                             
                                                        bind(   g)      ;g.            UnaryExpression =node =>                                                      
                                                   {if ('operator'in node               &&(node.operator ==='+'                                                      
                                                  ||node.operator ==='-')                 ) {g.   _space(   ) ;}                                                     
                                                     oldUnaryExpression(                  node) ;}        ;const                                                     
                                                 oldUpdateExpression =g.                  UpdateExpression. bind(                                                    
                                                g);g. UpdateExpression =                   node =>{let isPostfix =                                                   
                                                 false;if  ( 'prefix'in                    node && node.prefix){g.                                                   
                                                   _space( );}  else  {                      isPostfix  =   true;}                                                   
                                                 oldUpdateExpression(                       node);if (isPostfix){g.                                                  
                                              _space() ;}};g.space =(                        force =false) =>{if (g.                                                 
                                             _buf.hasContent() &&!g.                          endsWith(' ' ) &&!  g.                                                 
                                             endsWith('\n')||force){                           g._space(  );}else {g.                                                
                                             _optionalSpace();}};g.                            _space =  ()   => { g.                                                
                                             _append( constants.wN,                                  true)     ;} ;g.                                                
                                           _optionalSpace =() =>{g.                              _append(constants.lR,                                               
                                                   true)   ;}  ;g.                              _unbreakableSpace =   (                                              
                                           )  =>   { g.  _append(                                constants. JK,true)  ;}                                             
                                           ;const oldToken  = g.                                 token.bind(g);g.token =                                             
                                         str =>{if (str ==='=>')                                  { g._unbreakableSpace()                                            
                                        ;}  oldToken(str)   ;g.                                     _optionalSpace( )  ;}                                            
                                        ;return super.generate(                                      )   ;}  }      ;const                                           
                                       MAX_LINE_WIDTH = Number.                                     MAX_SAFE_INTEGER;function                                        
                                        minCodeSize( tokens) {                                      return tokens.     map(                                          
                                      toStr).reduce(  (  prev,                                        cur)    =>prev  + cur.                                         
                                      length, 0)  ;}function                                         minWidth(t){ if ('text'                                         
                                     in t) {return  t. text.                                           length;} else if   (t.                                        
                                    space  ===    'opt')  {                                            return  0;}return  1;}                                        
                                    function  toStr(t){if (                                            'text'in t)  {return t.                                       
                                   text;} else if (t. space                                              ==='opt'){return '';}                                       
                                    return  ' ' ;}function                                              isUbn(t){return 'space'                                      
                                  in t &&t.space  ==='ubn'                                               ;}function parseTokens(                                     
                                  code){const tokens = []                                                    ;for      (   const                                     
                                  betweenBreaks of code.                                                   split(constants.JK)) {                                    
                                const  betweenSpaces   =                                                   betweenBreaks.  split(                                    
                                constants.wN)  ;for   (                                                       const      sp     of                                   
                                  betweenSpaces){ const                                                       texts   = sp. split(                                   
                                constants.lR) ;for   (                                                      const text  of texts) {                                  
                               tokens.push({text  }  )                                                       ;tokens.push( {  space:                                 
                               'opt'});}tokens.push({                                                        space: 'req'});}tokens.                                 
                              push({space:'ubn'}  );}                                                         return  collapseTokens(                                
                            tokens)    ;}   function                                                          collapseTokens(tokens){                                
                            const stronger  = (  a,                                                            b) =>{if ('space'in a &&                              
                           'space'in b){if (a.space                                                            === 'ubn' ||b.space ===                               
                           'ubn'){return 'ubn'  ;}                                                              else if   (a. space ===                              
                          'req'||b.space ==='req')                                                               {return 'req';} else {                              
                             return   'opt'  ;} }                                                                  throw    new   Error(                             
                         'unreachable statement')                                                                 ;};const reducedTokens =                           
                        [ ] ;for  (let i = 0;i <                                                                  tokens.length;  i++  ){                            
                        const  lastToken = reducedTokens[ reducedTokens.length -1];const   curToken  =tokens[i];if ( 'text'in  curToken &&                           
                       curToken.text ===''){continue ;}if (lastToken ==null){reducedTokens.push(curToken);}else if ('space'in lastToken &&                           
                        'space'in  curToken){  lastToken.space =stronger(lastToken, curToken) ;} else  { reducedTokens. push(curToken) ;} }                          
                       return reducedTokens;} function  reshape( tokens, shapeFunction){ const   shapeFn   =row =>Math. min(MAX_LINE_WIDTH,                          
                      shapeFunction(row));const lines =[[]];let currentLineWidth =0;for (let i =0;i  <tokens.length;i++ ){const t =tokens[i]                         
                     ;const currentLineIndex =lines.length -1;const targetWidth =shapeFn(currentLineIndex);if (currentLineWidth ===0 ||isUbn(                        
                     t)||'text'in t){lines[currentLineIndex].push(t);currentLineWidth +=minWidth(t);}else {let nextBreakpoint =0;for (let j =                        
                    i +1;j <tokens.length;j++ ){if ('space'in tokens[j]&&!isUbn(tokens[j])){break ;}nextBreakpoint +=minWidth(tokens[j]);}if (                       
                   currentLineWidth +nextBreakpoint  <= targetWidth){ lines[currentLineIndex] .push(t);currentLineWidth +=minWidth(t);} else {                       
                   lines.push([{space:'opt'}]);currentLineWidth =0;}}}for (let i =0;i <lines. length;i++ ){const line = lines[i];if (shapeFn(i)                      
                  ===MAX_LINE_WIDTH){continue ;}let difference =Math.round(shapeFn(i)-minCodeSize(line));const spaceIndices =line.slice(0,line.                      
                   length  -1).map((t,idx)   =>({t,idx })).filter( ({t }) =>'space' in t).map(({idx })  =>idx);while  (spaceIndices.length >0 &&                     
                   difference > 0){const idx =spaceIndices[Math.floor(   spaceIndices. length  * Math.random( )) ] ;line[idx]={text:`${toStr(line[idx])              
                 } `};difference-- ;}}return lines.                                                                       map( line  =>line. map(                    
                 toStr). join(''))  ;}var  common =                                                                           __webpack_require__(                   
                          2824)       ;;function                                                                           findRegionsByIntensity(                   
               canvas,ctx,cutoffRatio, invert)  {                                                                            const  data   =   ctx.                  
              getImageData(0,0,canvas. width,                                                                               canvas.   height);const                  
              histogram = new  Array(                                                                                         constants.Ro).fill( 0)                 
             ;for (let i =0; i <data.                                                                                        data.length;i +=4){const                
             [r,g, b,a]  =data.data.                                                                                          slice(  i,i +  4);const                
            intensity =Math.round(a /                                                                                         255  *  (r   +g   +  b))               
           ;histogram[ intensity]++                                                                                            ;} const  cutoff =data.               
            width  *data. height *                                                                                             cutoffRatio;let  accum =              
          0;let  cutoffValue     =                                                                                              histogram.length -1;if (             
              invert){ histogram.                                                                                                reverse();}while (accum             
         <cutoff && cutoffValue >                                                                                                 0){accum += histogram[             
                    cutoffValue]                                                                                                  ;cutoffValue--  ;}if  (            
          invert){ cutoffValue =                                                                                                  histogram. length  -1  -           
       cutoffValue;}return  (0,                                                                                                    common.L) ( data.width,           
          data. height,  (row,                                                                                                     col) => {const i =row  *          
      data.width  +col;const [                                                                                                      r,g,b,  a] =data. data.          
     slice( i *4,( i +1)  *4)                                                                                                       ;const intensity  =Math.         
     round(a /255 *(r +g +b))                                                                                                          ;return    invert   ?         
    intensity <=cutoffValue :                                                                                                             intensity        >=        
      cutoffValue;});};class                                                                                                          Colour { static hex2lab(       
     hex){ const [r, g,b,a]=                                                                                                            Colour.hex2rgba( hex)        
      ;const [  x, y, z]  =                                                                                                            Colour.rgb2xyz(r,g,b,         
                        a)                                                                                                               ;return    Colour.          
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                      xyz2lab(   x,y, z);}static  rgba2lab(r, g,  b,a =1){const   [x,y, z]=Colour. rgb2xyz( r,g, b,a)                                                
                      ;return Colour.xyz2lab(x, y,z) ;}static lab2rgba( l,a,b) {const   [x,   y, z]= Colour. lab2xyz( l, a,b)                                        
                      ;return Colour.xyz2rgba(x,y, z);}static hex2rgba( hex){let c;if (hex.charAt(0)==="#" ){c =hex.substring(1).                                    
                        split(   ''   )   ;}   if  (    c.     length     >   6     ||  c.   length <   3)  {   throw   new   Error(                                 
                      `HEX colour must be 3 or 6 values. You provided it ${c.length}`);}if (c.length ===3){c =[c[0],c[0],c[1] ,c[1],c[                               
                      2],c[2]];}c ="0x"+c.join("");let r =c >>16 &255;let g =c >>8 &255;let b =c &255;let a =1;return [r, g,b,a];}static                             
                      rgb2xyz(r,g,b,a =1){if (r >255){r =255;}else if (r <0){r =0;}if (g >255){g =255;}else if (g <0){g =0;}if (b >255){b =                          
                      255;}else if (b <0){b =0;}if (a >1){a =1;}else if (a <0){a =0;}r =r /255;g =g /255;b =b /255;if (r >0.04045){r =Math.                          
                      pow((r +0.055)/1.055,2.4);}else {r =r /12.92;}if (g >0.04045){g =Math.pow((g +0.055)/1.055,2.4);}else {g =g /12.92;}if (                       
                      b >0.04045){b =Math.pow((b +0.055)/1.055,2.4);}else {b =b /12.92;}r =r *100;g =g *100;b =b *100;const x =r *0.4124564 +g                       
                      *0.3575761 +b *0.1804375;const y =r *0.2126729  +g  * 0.7151522  +b *0.0721750;const  z =r *0.0193339 +g *0.1191920  +b *                      
                      0.9503041;return [ x,y,z];}static xyz2rgba(x,y, z){let varX =x / 100;let varY =y /100;let varZ =z /100;let   varR =varX *                      
                       3.2404542  +varY  *  -                                                                  1.5371385 +varZ *  -0.4985314;let                     
                      varG =varX * -0.9692660                                                                         +varY * 1.8760108  + varZ *                    
                       0.0415560;let   varB =                                                                          varX *0.0556434 +varY  * -                    
                      0.2040259    +  varZ  *                                                                            1.0572252;if  (  varR   >                   
                      0.0031308)  {varR =1.055 *                                                                          Math. pow(varR, 1 /2.4)-                   
                      0.055;}else {varR =12.92                                                                               * varR;}if  (  varG  >                  
                      0.0031308){varG =1.055 *                                                                             Math.pow( varG,1  /2.4)-                  
                         0.055;}else { varG =                                                                               12.92 *varG;}if (varB >                  
                      0.0031308){varB =1.055 *                                                                              Math.pow(varB,1 / 2.4)-                  
                       0.055;} else { varB  =                                                                                12.92 *varB;}let r   =                  
                      Math. round( varR *255)                                                                                  ;let  g =Math.round(                  
                      varG *255);let b =Math.                                                                                  round(  varB  * 255)                  
                      ;return   [r,g,b, 1] ;}                                                                                static xyz2lab(x,y,z){                  
                       const   referenceX   =                                                                                94.811;const referenceY                 
                      =100;const referenceZ =                                                                                 107.304;x    = x    /                  
                        referenceX;y =   y  /                                                                                  referenceY;z =  z  /                  
                        referenceZ;if   ( x >                                                                                0.008856){x =Math.pow(                  
                      x,1 /3);}else {x =7.787                                                                                 *x +16 /116;} if (y >                  
                      0.008856){y = Math.pow(                                                                                y,1  /3);}else  { y  =                  
                      7.787 *y +16 /116;}if (                                                                                z >0.008856) {z =Math.                  
                      pow(z,1 /3) ;}else {z =                                                                                 7.787 * z  +16 /116;}                  
                        const l  = 116  *y  -                                                                                16;const a  =500 *(x -                  
                      y);const b =200 *(y -z)                                                                                  ;return  [l, a, b];}                  
                      static lab2xyz(l, a,b){                                                                                   const  referenceX =                  
                      94.811;const referenceY                                                                                =100;const referenceZ =                 
                      107.304;let varY = (l +                                                                                16)/116;let varX = a /                  
                       500  + varY;let varZ =                                                                                varY -b /200;if (Math.                  
                      pow( varY,3)>0.008856){                                                                                varY =Math.pow(varY,3)                  
                      ;}else {varY =(varY -16                                                                                /116)/7.787;}if (Math.                  
                      pow( varX,3)>0.008856){                                                                                varX =Math.pow(varX,3)                  
                      ;}else {varX =(varX -16                                                                                /116)/7.787;}if (Math.                  
                       pow(varZ,3)>0.008856){                                                                                varZ =Math.pow(varZ,3)                  
                      ;}else {varZ =(varZ -16                                                                                 /116)/7.787;} let x =                  
                      varX *referenceX;let y =                                                                              varY *referenceY;let z =                 
                           varZ             *                                                                              referenceZ;return [x, y,                  
                      z];}static deltaE00(l1,                                                                               a1,b1,l2,a2,b2){  Math.                  
                      rad2deg =function (rad)                                                                             { return  360 *rad /(2 *                   
                      Math.PI);};Math.deg2rad                                                                            =function (deg){return 2 *                  
                       Math.PI *deg   / 360;}                                                                          ;const  avgL = (l1  +  l2)/                   
                      2;const c1 = Math.sqrt(                                                                     Math.pow( a1,2)+Math.pow(b1,2))                    
                      ;const c2 =Math.sqrt(Math.pow(a2,2)+Math.pow(b2,2))  ;const avgC =(c1 +c2)/2;const g =(1 -Math.sqrt(Math.pow(avgC,7)/(Math.                    
                      pow(avgC,7)+Math.pow(25,7))))/2;const a1p =a1 *(1 +g);const a2p =a2 *(1 +g);const c1p =Math.sqrt(Math.pow(a1p,2)+Math.pow(                     
                       b1,2)) ;const c2p =Math.sqrt(Math.pow(a2p,2)+Math.pow(b2,2));const avgCp =(c1p +c2p)/2;let h1p =Math.rad2deg(Math.atan2(                      
                      b1,a1p));if (h1p <0){h1p =h1p  +360;}let h2p =Math.rad2deg(Math.atan2(b2,a2p));if (h2p <0){h2p =h2p +360;}const avghp =                        
                      Math.abs(h1p -h2p)>180 ?(h1p +h2p +360)/2 :(h1p +h2p)/2;const t =1 -0.17 *Math.cos(Math.deg2rad(avghp -30))+0.24 *Math.                        
                      cos(Math.deg2rad(2  *avghp))+0.32 *Math.cos(Math.deg2rad(3 *avghp +6))-0.2 *Math.cos(Math.deg2rad( 4 *avghp -63));let                          
                      deltahp =h2p -h1p;if (Math.abs(deltahp)>180){if (h2p <=h1p){deltahp +=360;}else {deltahp -=360;}}const deltalp =l2 -                           
                      l1;const deltacp =c2p -c1p;deltahp =2 *Math.sqrt(c1p *c2p)*Math.sin(Math.deg2rad(deltahp)/2);const sl =1 +0.015 *                              
                      Math.pow(avgL -50,2)/Math.sqrt(20 +Math.pow(avgL -50,2));const sc = 1 +0.045 *avgCp;const sh =1 +0.015 *avgCp *                                
                      t;const deltaro =30 *Math.exp( -Math.pow((avghp -275)/25,2));const rc =2 *Math.sqrt(Math.pow(avgCp,7)/(Math.                                   
                      pow(avgCp,7)+Math.pow(25,7)));const rt = -rc *Math.sin(2 *Math.deg2rad(deltaro));const kl =1;const kc =                                        
                      1;const kh =1;const deltaE =Math.sqrt(Math.pow(deltalp /(kl *sl),2)+Math.pow(deltacp /(kc *sc),2)+                                             
                       Math.pow(  deltahp /(kh *sh),2)+rt *(                                    deltacp   /(kc *  sc))*(                                             
                       deltahp   / ( kh *  sh)  ))                                              ;return    deltaE;}static                                            
                       getDarkerColour(r,g,b,a =  1,                                            darkenPercentage =0.05){let                                          
                      [l1,a1,b1]=Colour.rgba2lab(r,g,                                             b,  a)  ;l1   -=  l1     *                                         
                      darkenPercentage;if (l1 <0){l1                                             =0;}return Colour.lab2rgba(                                         
                        l1, a1,  b1);}   static                                                   getBrighterColour(r,g,b,a =                                        
                        1,brighterPercentage =                                                      0.05){ let [l1,a1,   b1]=                                        
                      Colour.rgba2lab(r, g,b,                                                         a) ;l1   +=    l1      *                                       
                      brighterPercentage;if (                                                         l1  >100)   {  l1 = 100;}                                      
                      return Colour.lab2rgba(                                                         l1,a1,b1);}}var lru_cache =                                    
                         __webpack_require__(                                                          7428);var lru_cache_default                                   
                      =__webpack_require__.n(                                                                lru_cache)   ;;const                                    
                       HISTOGRAM_THRESHOLD  =                                                              0.95;const bucketSize =                                   
                      256 /constants.p$;const                                                             toBucket = value => Math.                                  
                          floor(    value   /                                                                bucketSize)      ;const                                 
                      colorToIndex = (   r,g,                                                               b)  =>    toBucket( r)  *                                
                          constants.    p$  *                                                                 constants.p$ +toBucket(                                
                      g)* constants.  p$    +                                                                      toBucket( b) ;const                               
                      indexToColor =new Array(                                                                Math.pow(constants.p$,3))                              
                      .fill(0).map((_,idx) =>                                                                   { const  rIndex =  Math.                             
                      floor(idx  /(constants.                                                                   p$ * constants.p$));const                            
                      gIndex =Math.floor((idx                                                                     - rIndex) /constants.p$)                           
                        ;const  bIndex =idx -                                                                     rIndex -gIndex;return [ (                          
                        rIndex   +   0.5)   *                                                                      bucketSize,(gIndex +0.5)                          
                       *bucketSize, (bIndex +                                                                      0.5)*bucketSize];});const                         
                      rgbCache   =   new    (                                                                        lru_cache_default() )( {                        
                         max:  2 *  Math.pow(                                                                          constants.  p$, 3)  } )                       
                       ;function rgb2lab(r,g,                                                                         b) {const key =[r, g, b].                      
                      join(' ' );const res  =                                                                          rgbCache.get(key);if (res                     
                      !=   null){return res;}                                                                           else {const lab  =Colour.                    
                      rgba2lab(   r,   g,  b)                                                                             ;rgbCache.set(  key,lab)                   
                      ;return lab;}}const diff                                                                              =(  r1,g1, blu1,r2,g2,                   
                      blu2) =>{const [l1, a1,                                                                              b1]=rgb2lab(r1,g1, blu1)                  
                      ;const [  l2,  a2,b2] =                                                                               rgb2lab(  r2,  g2, blu2)                 
                            ;return   Colour.                                                                               deltaE00(l1,a1,b1, l2,a2,                
                         b2)    ;}     ;class                                                                                  CompressedHistogram   {               
                      constructor(histogram){                                                                                 this.compressed =[];this.              
                      originalToCompressedMap                                                                                  =new Map();const total =              
                      histogram.reduce((prev,                                                                                  cur) =>prev +cur,0);const             
                        target  = Math.round(                                                                                                total     *             
                         HISTOGRAM_THRESHOLD)                                                                                      ;const  sorted     =              
                       histogram.  map( (  v,                                                                                     idx) =>( {v,idx })).               
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
     sort((a,b) => b.v -a.v);let i,accum;for (i = 0,accum =0; i <sorted.length && accum <target;i++ ){  const { v,idx }= sorted[i];accum +=v;this.                   
      compressed.push({originalIndex: idx,count:v });this.originalToCompressedMap.set(idx,this.compressed.length -1);}for (;i <sorted.length;i++ ){                  
     const  { v,idx } = sorted[ i] ;const [r1,g1,  blu1]=indexToColor[idx];const  [l1, a1, b1] = rgb2lab(r1, g1,blu1);let  smallestDelta  = Number.                  
     MAX_SAFE_INTEGER;let smallestDeltaIdx =0;for (const   {delta, idx   } of this.compressed. map( ({originalIndex }, idx) =>{const [r2,g2,blu2] =                  
     indexToColor[ originalIndex];const [l2,a2,b2]=rgb2lab(r2, g2,blu2);return {delta:Colour.deltaE00(l1,a1,b1,l2,a2,b2) , idx  }  ;})){if (delta <                  
     smallestDelta){smallestDelta =delta;smallestDeltaIdx =idx;}}this.compressed[smallestDeltaIdx].count +=v;this.originalToCompressedMap. set(idx,                  
     smallestDeltaIdx);}} saliency(r,g,b){  const pixelIndex =colorToIndex( r, g, b);const compressedPixelIndex = this.originalToCompressedMap.get(                  
     pixelIndex);return this.compressed.reduce((prev,cur,idx) =>{if (idx ===compressedPixelIndex){return prev;}else {const [rh,gh,bh]=indexToColor[                  
     cur. originalIndex];return   prev +cur.count *diff(r,g,b,rh,gh,bh);}},0);}}function findRegionsBySaliency(canvas,ctx,cutoffRatio,invert){const                  
     data =ctx.getImageData(0,0,canvas.width,canvas.height);const colorHistogram  =new Array(Math.pow(constants.p$,3) ) .fill(0);for (let i =0; i <                  
     data.data.length;i +=4){const [r,g,b]=data.data.slice(i,i +3);colorHistogram[colorToIndex(r,g,b)]++ ;}const histogram =new CompressedHistogram(                 
     colorHistogram);const perPixelSaliency = new Array(canvas.width *canvas.height);for (let i = 0;i <data.data.length;i +=4){const [r,g,b] =data.                  
                    data.slice(i,i  + 3);perPixelSaliency[i /4]=histogram.saliency(r,g,b);}const sortedPixels =perPixelSaliency.concat().sort((a,                    
                                                               b) =>invert  ?a -b :b -a)                                                                             
                                                                ;const cutoffValue     =                                                                             
                                                               sortedPixels[Math. round(                                                                             
                                                               cutoffRatio *sortedPixels.                                                                            
                                                               length)];return (0,common.                                                                            
                                                                  L) (data. width,  data.                                                                            
                                                                height,(row,col) =>{const                                                                            
                                                                i   =row * data.width  +                                                                             
                                                                     col;return invert ?                                                                             
                                                                 perPixelSaliency[ i] <=                                                                             
                                                                      cutoffValue      :                                                                             
                                                                 perPixelSaliency[ i] >=                                                                             
                                                                  cutoffValue;} );} ;var                                                                             
                                                                 __awaiter =undefined &&                                                                             
                                                                  undefined.__awaiter ||                                                                             
                                                                   function  (  thisArg,                                                                             
                                                                 _arguments,P,generator)                                                                             
                                                                 {function adopt(value){                                                                             
                                                                 return value instanceof                                                                             
                                                                  P  ? value  :   new P(                                                                             
                                                                  function  ( resolve) {                                                                             
                                                                   resolve(value) ;}) ;}                                                                             
                                                                 return  new  (P ||( P =                                                                             
                                                                  Promise))( function  (                                                                             
                                                                   resolve,  reject)   {                                                                             
                                                                     function fulfilled(                                                                             
                                                                  value) { try  {  step(                                                                             
                                                                 generator.next( value))                                                                             
                                                                 ;}catch (e){reject(e);}                                                                             
                                                                  }   function rejected(                                                                             
                                                                 value)   { try  { step(                                                                             
                                                                     generator["throw"](                                                                             
                                                                  value) );}  catch (e){                                                                             
                                                                 reject( e);}}  function                                                                             
                                                                   step(result) {result.                                                                             
                                                                  done ? resolve(result.                                                                             
                                                                  value)  :adopt(result.                                                                             
                                                                 value). then(fulfilled,                                                                             
                                                                  rejected) ;} step(   (                                                                             
                                                                 generator  = generator.                                                                             
                                                                    apply(      thisArg,                                                                             
                                                                 _arguments ||[])).next(                                                                             
                                                                   )  ) ;} ) ;};function                                                                             
                                                                   drawCodeCommon( code,                                                                             
                                                                   imageFileUri,   mode,                                                                             
                                                                      cutoff,    invert,                                                                             
                                                                   loadImageToCanvas)  {                                                                             
                                                                 return __awaiter( this,                                                                             
                                                                 void 0,void 0,function*                                                                             
                                                                 (){const  genCode  =new                                                                             
                                                                 WhitespaceMarkerGenerator(                                                                          
                                                                 (0,lib.Qc)  (  code)) .                                                                             
                                                                 generate( ). code;const                                                                             
                                                                  tokens =  parseTokens(                                                                             
                                                                 genCode) ;if  (invert){                                                                             
                                                                   cutoff =1   -cutoff;}                                                                             
                                                                  const    targetSize  =                                                                             
                                                                  minCodeSize(  tokens)*                                                                             
                                                                     constants.    yU  /                                                                             
                                                                 cutoff;const   {canvas,                                                                             
                                                                     ctx      }        =                                                                             
                                                                 yield loadImageToCanvas(                                                                            
                                                                           imageFileUri,                                                                             
                                                                 targetSize);const runs =                                                                            
                                                                   mode  ==='saliency' ?                                                                             
                                                                  findRegionsBySaliency(                                                                             
                                                                  canvas,ctx,    cutoff,                                                                             
                                                                           invert)     :                                                                             
                                                                 findRegionsByIntensity(                                                                             
                                                                 canvas,  ctx,   cutoff,                                                                             
                                                                 invert);const shapeFn =                                                                             
                                                                 i  =>i < runs.length  ?                                                                             
                                                                 runs[i].length :Number.                                                                             
                                                                  MAX_SAFE_INTEGER;const                                                                             
                                                                 codeSegments = reshape(                                                                             
                                                                 tokens,  shapeFn) ;if (                                                                             
                                                                   codeSegments.length >                                                                             
                                                                     runs.length  +  1){                                                                             
                                                                   throw     new  Error(                                                                             
                                                                 `Unexpected segment length of ${                                                                    
                                                                           codeSegments.                                                                             
                                                                  length} from ${  runs.                                                                             
                                                                 length} runs`);}while (                                                                             
                                                                  codeSegments. length <                                                                             
                                                                  runs. length) {  const                                                                             
                                                                  nextRunLength  = runs[                                                                             
                                                                  codeSegments. length].                                                                             
                                                                        length;if      (                                                                             
                                                                   nextRunLength  >  5){                                                                             
                                                                 codeSegments.push(`/*${                                                                             
                                                                     'o'    .    repeat(                                                                             
                                                                 nextRunLength  -4)}*/`)                                                                             
                                                                  ;}else { codeSegments.                                                                             
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     
                                                                                                                                                                     

push(' '.repeat(nextRunLength));}}let result ='';let runIndex =0;for (let row =0;row <canvas.height;row++ ){for (let col =0;col <canvas.width;col++ ){const i =row *canvas.width +col;if (runIndex <runs.length &&i >=runs[runIndex][0]){result +=codeSegments[runIndex]+' ';col +=codeSegments[runIndex].length;runIndex++ ;}else {result +=' ';}}result +='\n';}for (let i =runIndex;i <codeSegments.length;i++ ){result +=`\n${codeSegments[i]}`;}return result;});};var entry_dom_awaiter =undefined &&undefined.__awaiter ||function (thisArg,_arguments,P,generator){function adopt(value){return value instanceof P ?value :new P(function (resolve){resolve(value);});}return new (P ||(P =Promise))(function (resolve,reject){function fulfilled(value){try {step(generator.next(value));}catch (e){reject(e);}}function rejected(value){try {step(generator["throw"](value));}catch (e){reject(e);}}function step(result){result.done ?resolve(result.value):adopt(result.value).then(fulfilled,rejected);}step((generator =generator.apply(thisArg,_arguments ||[])).next());});};const pica =__webpack_require__.e(183).then(__webpack_require__.t.bind(__webpack_require__,5183,23));function loadImageToCanvas(imageFileUri,targetSize){return entry_dom_awaiter(this,void 0,void 0,function*(){const source =document.createElement('canvas');const ctx =source.getContext('2d');yield new Promise((resolve,reject) =>{const handler =() =>{source.width =Math.floor(image.width);source.height =Math.floor(image.height);ctx.drawImage(image,0,0,source.width,source.height);resolve();};const image =new Image();image.onload =handler;image.onerror =reject;image.src =imageFileUri;});const target =document.createElement('canvas');const ratio =Math.sqrt(targetSize /(source.width *source.height));target.width =Math.round(source.width *ratio *Math.sqrt(constants.xO));target.height =Math.round(source.height *ratio /Math.sqrt(constants.xO));const resizer =(yield pica).default();yield resizer.resize(source,target);return {canvas:target,ctx:target.getContext('2d')};});}function drawCode(code,imageFileUri,mode,cutoff,invert){return entry_dom_awaiter(this,void 0,void 0,function*(){console.time('code shaping');const result =yield drawCodeCommon(code,imageFileUri,mode,cutoff,invert,loadImageToCanvas);console.timeEnd('code shaping');return result;});}}}]); 