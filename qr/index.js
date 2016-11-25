
function enable_drop(dropbox, form, on_upload, on_text) {
  var form = $(form);
  var upload_input = form.find('input[type=file]');
  upload_input.change(function() {
    var files = upload_input.get(0).files;
    on_upload(files, form);
  });
  upload_input.click(function () {
    upload_input.val(null);
  });

  form.find('.select-file').click(function() {
    upload_input.click();
  });

  dropbox = $(dropbox);
  dropbox.on('dragenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropbox.css('border', '2px solid #0B85A1');
  });
  dropbox.on('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropbox.css('border', '');
  });

  dropbox.on('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropbox.css('border', '2px solid #0B85A1');
  });

  dropbox.on('drop', function(e) {
    dropbox.css('border', '2px dotted #0B85A1');
    e.preventDefault();
    var dt = e.originalEvent.dataTransfer;
    var files = dt.files;
    var text_item = null;
    $.each(dt.items, function(i, item) {
        if(item.type == 'text/plain') {
            text_item = item;
        }
    });
    if(text_item && on_text) {
        text_item.getAsString(function (text) {
            on_text(text, form, dt);
        });
    }
    if(files.length > 0) {
        on_upload(files, form, dt);
    }
  });
}

function getVideoDevice(callback) {
  var device_ids = [];
  try {
    MediaStreamTrack.getSources(function (sourceInfos) {
      for (var i = 0; i < sourceInfos.length; i++) {
        if(sourceInfos[i].kind == 'video') {
          device_ids.push(sourceInfos[i].id);
        }
      }
      callback(device_ids);
    });
  } catch(e) {
      console.error(e);
      callback(device_ids);
  }
}

function start_scan() {
  var media = start_scan;
  if(location.protocol != 'https:') {
    alert('video works only in https');
    location.href = location.href.replace(location.protocol, 'https:');
    return;
  }
  if(!media.device_id) {
    getVideoDevice(function(device_ids) {
      if(device_ids.length > 0) {
        media.device_id = device_ids.pop();
        media();
      } else {
        console.error('no device found');
      }
    });
    return;
  }
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  var webkit = navigator.getUserMedia || navigator.webkitGetUserMedia || false;
  var firefox = navigator.mozGetUserMedia || false;
  navigator.getUserMedia({
    video: {
        'optional': [{
            'sourceId': media.device_id
        }]
    },
    audio: false
  }, function (stream) {
    console.log('getUserMedia ok');
    var video = $('#qr-video')[0];
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
        video.play();
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }

    var canvas_qr = document.getElementById('qr-canvas');
    var context = canvas_qr.getContext('2d');
    canvas_qr.width = 800;
    canvas_qr.height = 600;
    $(canvas_qr).hide();
    $(video).show();
    $('#start-scan').hide();
    function capture_to_canvas() {
      try {
        context.drawImage(video, 0, 0);
        qrcode.decode();
        $(canvas_qr).show();
        $(video).hide();
        $('#start-scan').show();
        try {
          video.pause();
        } catch(e) {
        }        
      } catch(e) {       
        console.log(e);
        setTimeout(capture_to_canvas, 500);
      };
    }
    setTimeout(capture_to_canvas, 500);
  }, function(error) {
    console.info('getUserMedia failed: ', error);
  });
}

function make_qrcode(text, width) {
  width = width || 256;
  var div = $('<div></div>');
  //var div = $('#qrcode');
  div.qrcode({
    width: width,
    height: width,
    text: text
  });
  var url = div.find('canvas')[0].toDataURL();
  $('#qr_img').attr('src', url);
}

function decode_qrcode(files, form) {
  if(files.length == 0) {
    return;
  }
  var file = files[0];
  console.info(file);
  var reader = new FileReader();
  reader.onload = function(e) {
    qrcode.decode(e.target.result);
  };
  reader.readAsDataURL(file);
}

function get_dwz() {
    var url = $('textarea[name=t]').val();
    var width = $('select[name=width]').val();
    url = 'https://azul.sinaapp.com/qr/?width=' + width + '&t=' + encodeURIComponent(url);
    $.post('dwz.php', {url: url}, function(data) {
        $('#qrtext').text('短网址: ' + data);
    });
}

$(document).ready(function() {
  var obj = {};
  location.search.substr(1).split('&').forEach(function(item) {
    var kv = item.split('=');
    if(kv.length > 0) {
      obj[kv[0]] = kv.length > 1 ? decodeURIComponent(kv[1]) : null;
    }
  });

  if(obj.t) {
    make_qrcode(obj.t, obj.width);
  } else {
    $('div.hidden').removeClass('hidden');
    qrcode.callback = function(result) {
      $('#qrtext').text('result: ' + result);
      $('textarea[name=t]').val(result);
      make_qrcode(result, 128);
    };
    enable_drop('div.qrfile', 'div.qrfile>form', decode_qrcode, decode_qrcode);
    $('#start-scan').click(start_scan);
    $('#get-dwz').click(get_dwz);
  }
});