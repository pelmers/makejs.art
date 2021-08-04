import { CodeGenerator } from '@babel/generator';
import { Node } from '@babel/types';
/**
 * This class generates runnable JS code where replaceable whitespace is
 * annotated with special comments
 */
export declare class WhitespaceMarkerGenerator extends CodeGenerator {
    constructor(ast: Node);
    generate(): import("@babel/generator").GeneratorResult;
}
