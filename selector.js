(function() {
    var result = document.getElementById('result');
    var domNode = document.getElementsByClassName('target')[0];

    var uniquePath = null;
    var path = [];
    var node = null;
    var foundUnique = false;

    var traverseUpTree = function(domNode) {
        if (!foundUnique) {
            if (domNode.className && isClassUnique(domNode.className)) {
                var className = getClassNames(domNode.classList);
                node = '.' + className.replace(' ', '.');
                path.push(node);
                foundUnique = true;
            } else {
                node = domNode.localName;
                path.push(node);
                path.push('>');
            }
        }
        if (domNode.nodeName !== 'BODY') {
            traverseUpTree(domNode.parentNode);
        } else {
            path.push(domNode.localName);
        }
    };

    var isClassUnique = function(className) {
        return document.getElementsByClassName(className).length === 1;
    };

    var getClassNames = function(classNameList) {
        var classNames = '';
        for (var i = 0; i < classNameList.length; i++) {
            classNames += classNameList[i];
            if (i < classNameList.length - 1) {
                classNames += ' ';
            }
        };
        return classNames;
    }

    traverseUpTree(domNode);

    uniquePath = path.reverse().join(' ');

    result.innerHTML = uniquePath;

    if ($$(uniquePath).length === 1) {
        $$(uniquePath).setStyle('outline', '3px solid green');
    } else {
        $$(uniquePath).setStyle('outline', '3px solid red');
    }

}());