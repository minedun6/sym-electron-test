$(function() {
  var getQueryStringMap = function(useHash) {
    if (!useHash) {
      useHash = true;
    }
    var varMap = {};
    // if useHash is false then we'll use the parameters after '?'
    var queryString = useHash ? window.location.hash : window.location.search.substring(1);
    var fieldValPairs = queryString.split('&');

    for (var i = 0; i < fieldValPairs.length; i++) {
      var fieldVal = fieldValPairs[i].split('=');
      varMap[fieldVal[0]] = fieldVal[1];
    }

    return {
      getBoolean: function(field, defaultValue) {
        var value = varMap[field];

        if (value !== undefined && value != null) {
          value = value.toLowerCase();

          if (value === 'true' || value === 'yes' || value === '1') {
            return true;
          } else if (value === 'false' || value === 'no' || value === '0') {
            return false;
          }
          // convert to boolean
          return !!field;
        }
        if (defaultValue === undefined || defaultValue === null) {
          return null;
        }
        return defaultValue;
      },
      getString: function(field, defaultValue) {
        var value = varMap[field];

        if (value !== undefined && value !== null) {
          return decodeURIComponent(value);
        }
        if (defaultValue === undefined || defaultValue === null) {
          return null;
        }
        return defaultValue;
      }

    };
  };

  var queryParams = getQueryStringMap(false);
  var docType = queryParams.getString('doctype');

  var getDocId = function(filePath) {
    return filePath.replace(/^.*[\\/]/, '');
  };

  //var initialDoc = '../files/form1.' + docType;

  var viewerElement = document.getElementById('viewer');
  var myWebViewer = new PDFTron.WebViewer({
    type: 'html5',
    path: '../../lib',
    l: 'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0',
    //initialDoc: initialDoc,
    documentType: docType,
    //documentId: getDocId(initialDoc),
    enableAnnotations: true,
    mobileRedirect: false,
    showLocalFilePicker: true
  }, viewerElement);
  var $docUrlInput = $('#docUrlInput');
  if (docType != null) {
    $docUrlInput.attr('placeholder', 'Enter a ' + docType.toUpperCase() + ' file URL...');
  }

  $('#loadDWG').on('click', function() {
    // var webHostName = window.location.hostname + ":" + window.location.port + "/";
    var webHostName = "http://scorpius.pdftron.local:8090/";
    var docUrl = $docUrlInput.val();
    if (docUrl === '') {
      alert('Please enter a URL to load');
    }
    else
    {
      var viewerInstance = myWebViewer.getInstance();
      var docViewer = viewerInstance.docViewer;
      var doc = docViewer.getDocument();
      // var myUrl = "http://demo.pdftron.com:8090/blackbox/GetPDF?uri=http%3A%2F%2Fpdftron.s3.amazonaws.com%2Fdownloads%2Fdownloadertest%2Ftest8.pdf"
      var myUrl = webHostName + "blackbox/GetPDF?uri=" + encodeURIComponent(docUrl);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', myUrl);
      xmlHttp.responseType = 'json';
      xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
      xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xmlHttp.onreadystatechange = function() {
        // readystate 4 means ""Done"
        if (xmlHttp.readyState === 4) {
          //me.dataBufPromise = null;
          try {
            // 200 means "OK"
            if (xmlHttp.status === 200) {
              // xmlHttp.response contains the requested json data
              var uri = xmlHttp.response[0].uri;
              uri = uri.substr(uri.indexOf('/'), uri.length - uri.indexOf('/'));
              myWebViewer.loadDocument(webHostName + uri);
            } else {
              myWebViewer.loadDocument("");
              // there was some kind of error
            }
          } catch (e) {
            // there was some other kind of error
          }
		    }
      };
      xmlHttp.send();
    }
  });

});
