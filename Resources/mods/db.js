var Config = require('/libs/Config');

exports.checkDB = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('CREATE TABLE IF NOT EXISTS lastsong (id INTEGER PRIMARY KEY, json_values TEXT);');
	db.close();
};


exports.dropLASTSONG = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS lastsong');
	db.execute('CREATE TABLE IF NOT EXISTS lastsong (id INTEGER PRIMARY KEY, json_values TEXT);');
	db.close();
};


exports.selectLASTSONG = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var element = [];

	var res = db.execute('SELECT id, json_values FROM lastsong');
	while (res.isValidRow()) {
		element.push({
			id : res.fieldByName('id'),
			values : JSON.parse(res.fieldByName('json_values'))
		});
		res.next();
	}

	res.close();
	db.close();
	

	if (Config.mode == 0) {
		Ti.API.info('db.selectLASTSONG: ' + JSON.stringify(element));
	}
	return element;
};





exports.insertLASTSONG = function(data) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.insertLASTSONG: ' + JSON.stringify(data));
	}
	var flagExiste = false;
	var res = db.execute('SELECT id, json_values FROM lastsong');
	while (res.isValidRow()) {
		var values = JSON.parse(res.fieldByName('json_values'));
		if (values.artistName + ' - ' + values.trackName == data.artistName + ' - ' + data.trackName)
		{
			flagExiste = true;
			break;
		}
		res.next();
	}
	if (flagExiste == false)
		db.execute('INSERT INTO lastsong (json_values) VALUES (?)', JSON.stringify(data));
	res.close();
	db.close();
};

exports.deleteLASTSONG = function(IDin) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.deleteLASTSONG: ' + JSON.stringify(IDin));
	}

	db.execute('DELETE FROM lastsong WHERE id = ?', IDin);

	db.close();
};

