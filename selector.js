(function() {
    var result = document.getElementById('result');
    var domNode = document.getElementsByClassName('target')[0];

    var UniqueSelector = {};

    UniqueSelector.get = function(domNode) {
        var uniqueSelector = null;
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
                    var position = getSiblingPosition(domNode);
                    if (position !== 0) { // 0 direct child
                        node = node + ':nth-of-type(' + position + ')';
                    }
                    path.push(node);
                    path.push('>');
                }
            }
            if (domNode.nodeName !== 'BODY' && domNode.className.indexOf('moduleId_') === -1) {
                traverseUpTree(domNode.parentNode);
            } else {
                path.push(domNode.localName);
            }
        };

        var getModuleIdClass = function(domNode) {
            var moduleIdClass = '';
            var classList = domNode.classList;
            for (var i = 0; i < classList.length; i++) {
                if (classList[i].indexOf('moduleId_') !== -1) {
                    moduleIdClass = '.' + classList[i];
                }
            }
            return moduleIdClass;
        };

        // 0 if direct child
        // 1 if first child
        var getSiblingPosition = function(domNode) {
            var position = 0;

            var countPrevSiblings = function(elm) {
                if (elm.previousElementSibling !== null) {
                    if (position === 0) {
                        position = 1;
                    }
                    if (elm.previousElementSibling.localName === domNode.localName) {
                        position = position + 1;
                    }
                    countPrevSiblings(elm.previousElementSibling);
                }
            };

            var countNextSiblings = function(elm) {
                if (elm.nextElementSibling !== null) {
                    if (elm.nextElementSibling.localName === domNode.localName) {
                        if (position === 0) {
                            position = 1;
                        }
                    }
                    countNextSiblings(elm.nextElementSibling);
                }
            };

            countPrevSiblings(domNode);
            countNextSiblings(domNode);

            return position;
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
            }
            return classNames;
        };

        traverseUpTree(domNode);

        uniqueSelector = path.reverse().join(' ');

        return uniqueSelector;
    };

    var uniquePath = UniqueSelector.get(domNode);

    result.innerHTML = uniquePath;

    if ($$(uniquePath).length === 1) {
        $$(uniquePath).setStyle('outline', '3px solid green');
    } else {
        $$(uniquePath).setStyle('outline', '3px solid red');
    }

}());