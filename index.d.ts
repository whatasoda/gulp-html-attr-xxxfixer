/// <reference types="node" />
import Stream = require('stream');
export = HTMLAttrXXXfixer;
declare function HTMLAttrXXXfixer(rules: HTMLAttrXXXfixer.Rule[]): Stream.Transform;
declare namespace HTMLAttrXXXfixer {
    function prefix(prefix: string, attrNames: string[]): Rule[];
    function suffix(prefix: string, attrNames: string[]): Rule[];
    interface Rule {
        attrName: string;
        prefix?: string;
        suffix?: string;
        pattern?: RegExp;
        filter?: Filter;
    }
    type Filter = (value: string) => boolean;
}
