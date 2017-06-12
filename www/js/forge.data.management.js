/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $('#refreshAutodeskTree').hide() 

    getForgeToken(function (token) {
        if (token === '') {
            $('#loginAutodesk').click(forgeLogin) 
        } else {
            $('#refreshAutodeskTree').show() 
            $('#refreshAutodeskTree').click(function () {
                $('#myAutodeskFiles').jstree(true).refresh() 
            }) 

            getForgeUserProfile(function (profile) {
                $('#loginAutodeskProfileImage').removeClass()  // remove glyphicon-user
                $('#loginAutodeskProfileImage').html('<img src="' + profile.picture + '"/>')
                $('#loginAutodeskText').text(profile.name) 
                $('#loginAutodeskText').attr('title', 'Click to forgeLogoff') 
                $('#loginAutodesk').click(forgeLogoff) 
            }) 

            prepareDataManagementTree() 
        }
    }) 
}) 

function prepareDataManagementTree() {
    $('#myAutodeskFiles').jstree({
        'core': {
            'themes': {"icons": true},
            'data': {
                "url": '/dm/getTreeNode',
                "dataType": "json",
                'multiple': false,
                "data": function (node) {
                    return {"id": node.id} 
                }
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            '#': {
                'icon': 'glyphicon glyphicon-user'
            },
            'hubs': {
                'icon': 'glyphicon glyphicon-inbox'
            },
            'projects': {
                'icon': 'glyphicon glyphicon-list-alt'
            },
            'items': {
                'icon': 'glyphicon glyphicon-file'
            },
            'folders': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'versions': {
                'icon': 'glyphicon glyphicon-time'
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: {items: autodeskCustomMenu}
    }) 
}

function autodeskCustomMenu(autodeskNode) {
    var items 

    if (autodeskNode.type == 'versions') {
        items = {
            sendToOnedrive: {
                label: "Send to OneDrive",
                icon: "/img/onedrive-logo-32.png",
                action: function () {
                    var onedriveNode = $('#myOnedriveFiles').jstree(true).get_selected(true)[0] 
                    sendToOnedrive(autodeskNode, onedriveNode) 
                }
            }
        } 
    }

    return items 
}

function sendToOnedrive(autodeskNode, onedriveNode) {
    if (onedriveNode == null || onedriveNode.type != 'folder') {
        $.notify('Please select a folder on OneDrive Folders', 'error')
        return 
    }
    $.notify(
        'Preparing to send file "' + autodeskNode.text + '" to "' + onedriveNode.text +
        '" OneDrive ' + onedriveNode.type, 'info'
    ) 

    jQuery.ajax({
        url: '/integration/sendToOnedrive',
        contentType: 'application/json',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            'autodeskfile': autodeskNode.id,
            'onedrivefolder': onedriveNode.id
        }),
        success: function (res) {
            $.notify('Transfer of file "' + res.file + '" completed', 'info') 
            $('#myOnedriveFiles').jstree(true).refresh_node(onedriveNode) 
        },
        error: function (res) {
            $.notify(res.responseText, 'error') 
        }
    }) 
}

function forgeLogin() {
    jQuery.ajax({
        url: '/user/authenticate',
        success: function (rootUrl) {
            location.href = rootUrl 
        }
    }) 
}

function forgeLogoff() {
    jQuery.ajax({
        url: '/user/forgeLogoff',
        success: function (oauthUrl) {
            location.href = oauthUrl 
        }
    }) 
}

function getForgeToken(callback) {
    jQuery.ajax({
        url: '/user/token',
        success: function (token) {
            if (token != '')
                console.log('3 legged token (User Authorization): ' + token)  // debug

            callback(token) 
        },
        error: function (err) {
            callback('') 
        }
    }) 
}

function getForgeUserProfile(onsuccess) {
    var profile = '' 
    jQuery.ajax({
        url: '/user/profile',
        success: function (profile) {
            onsuccess(profile) 
        }
    }) 
}