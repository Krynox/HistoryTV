/**
 * Created by James on 5/01/2015.
 */
var converter= require("./../converters/binaryConverter");
var should=require('should');
describe("BufferToBinaryString", function () {
    it("This should return a string from an arrayBuffer", function () {
        var buffer = new ArrayBuffer(12);
        var dataView = new DataView(buffer);
        dataView.setInt32(0, 0x1234ABCD);
        converter.BufferToBinaryString(buffer).should.be.type('string');
    });
});