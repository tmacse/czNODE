//这是网上的摘抄的一个处理图片大小的code，还未鉴定
function pi(base64, bili = 2) {
    return new Promise((resolve, rejects) => {
        //处理缩放，转格式
        var _img = new Image();
        _img.src = base64;
        _img.onload = function () {
            var _canvas = document.createElement("canvas");
            var w = this.width / bili;
            var h = this.width / bili;
            _canvas.setAttribute('width', w);
            _canvas.setAttribute('height', h);
            _canvas.getContext('2d').drawImage(this, 0, 0, w, h);
            var base64 = _canvas.toDataURL("image/jpeg");
            _canvas.toBlob(function (blob) {
                if (blob.size > 1024 * 1024) {
                    suofang(base64, bili)
                } else {
                    resolve(base64);
                }
            }, "image/jpeg");
        }
    })
}