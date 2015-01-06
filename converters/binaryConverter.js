/**
 * Created by James on 5/01/2015.
 */
binaryConverter=function(){
    BufferToBinaryString=function(buffer){
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return binary ;
    }
    return {BufferToBinaryString:BufferToBinaryString}
}();
module.exports=binaryConverter;