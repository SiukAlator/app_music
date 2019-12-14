// Grab a reference to the service and its intent
var service = Ti.Android.currentService;
//var serviceIntent = service.intent;
var db = require('/mods/db');
//Ti.API.info(service.serviceInstanceId);
 
// Bind event listeners to the service
if (!Ti.App.Properties.getBool('bind')) {
     
    Ti.App.Properties.setInt('inc', 0);
         
    service.addEventListener('taskremoved', function(){
        Ti.API.info('**************************** taskremoved fired');  
    });
    service.addEventListener('pause', function(){
        Ti.API.info('**************************** pause fired');  
    });
    service.addEventListener('resume', function(){
        Ti.API.info('**************************** resume fired');  
    });
 
    Ti.App.Properties.setBool('bind', true);
}
 
/*var count = Ti.App.Properties.getInt('inc') || 0;
if (count >= 10) {
    // Stop the service
    service.stop(serviceIntent);       
} else {
    Ti.App.Properties.setInt('inc', ++count);
}*/

function BKTracking() {
	Ti.API.info('call BKTracking');  
	db.checkDB();

	var listaTrackingComplete = db.selectASYNCTRACING();
	var flagExiste = false;
	for (var index in listaTrackingComplete) {
		flagExiste = true;
	}

	if (flagExiste == true) {

		var data = listaTrackingComplete.data;

		for (index in data) {

			var trackerName = 'Profesional de terreno: Open async';
			Config.tracker.addScreenView(trackerName);

			var pathImages = data[index].images;
			var nameImages = data[index].name_images;
			var date_update = data[index].date_update;

			if (data[index].code == null) {
				db.deleteTRACING(data[index].code);
			} else {
				/*
				if (loc.success == true) {
					data[index].values.geolocation.send = {
						timestamp : async.moment.utc().valueOf(),
						lon : loc.coords.longitude,
						lat : loc.coords.latitude
					};
				} else {
					data[index].values.geolocation.send = {
						error : true
					};
				}
				*/
				var picture = null;

				var vartoken = Ti.App.Properties.getString('me', null);
				var varid_tracing = data[index].code;

				Config.tracker.addEvent({
					category : trackerName,
					action : 'Envia datos a servidor',
					label : 'ID tracking:' + varid_tracing,
					value : 1
				});

				var params = {
					token : vartoken,
					id_tracing : varid_tracing,
					info : data[index].values
				};
				var arrayImages = [];
				var arrayImagesThumb = [];
				if (pathImages != null) {
					if (pathImages[index] != null && pathImages[index] != '') {
						for (var jindex in pathImages) {
							var file = Ti.Filesystem.getFile(pathImages[jindex]);
							var nameThumb = pathImages[jindex] + Config.hashThumbnail;
							var fileThumb = Ti.Filesystem.getFile(nameThumb);
							var picture = file.read();
							var pictureThumb = fileThumb.read();
							arrayImages.push(picture);
							arrayImagesThumb.push(pictureThumb);
						}
					}
				}

				xhr.subirTracing(callback, data[index].code, pathImages, params, arrayImages, arrayImagesThumb, nameImages, date_update);

			}

		}

	}
}

function callback(id, path, response, date_updateLast) {

	if (id != false) {
		if (response.status.code == 200) {
			if (path != null && path != '') {

				for (var index in path) {

					var file = Ti.Filesystem.getFile(path[index]);

					if (file.exists()) {
						file.deleteFile();
					}
				}
			}

			var date_update = db.selectTRACINGDate_Update(id);
			if (date_update == null) {
				db.deleteTRACING(id);
			} else if (JSON.parse(date_update['date_update']) == date_updateLast) {
				db.deleteTRACING(id);
			}
		}
	}

}

BKTracking();
