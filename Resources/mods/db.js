var Config = require('/libs/Config');

exports.checkDB = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('CREATE TABLE IF NOT EXISTS keyval (key TEXT PRIMARY KEY, val TEXT);');
	db.execute('CREATE TABLE IF NOT EXISTS general (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT);');
	db.execute('CREATE TABLE IF NOT EXISTS movimientos_dash (id INTEGER PRIMARY KEY, tipo TEXT, id_in TEXT, json_values TEXT, date_in TEXT);');
	db.execute('CREATE TABLE IF NOT EXISTS avisos_dash (id INTEGER PRIMARY KEY,  id_in TEXT, json_values TEXT, date_in TEXT);');
	db.execute('CREATE TABLE IF NOT EXISTS tracingUpdate (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT, json_images TEXT, name_images TEXT, date_update TEXT);');
	
	db.close();
};

exports.initKEY = function(){
	var db = Ti.Database.open(Config.DATABASE_NAME);
	this.insertKEYVAL(Config.KEYVAL_INIT);
    this.updateKEYVAL(Config.KEYVAL_STATIC);
    db.close();
};

exports.dropMOVIMIENTOS = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS movimientos_dash');
	db.execute('CREATE TABLE IF NOT EXISTS movimientos_dash (id INTEGER PRIMARY KEY, tipo TEXT, id_in TEXT, json_values TEXT, date_in TEXT);');
	db.close();
};

exports.dropAVISOS = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS avisos_dash');
	db.execute('CREATE TABLE IF NOT EXISTS avisos_dash (id INTEGER PRIMARY KEY,  id_in TEXT, json_values TEXT, date_in TEXT);');
	db.close();
};

exports.dropGENERAL = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS general');
	db.execute('CREATE TABLE IF NOT EXISTS general (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT);');
	db.close();
};

exports.dropTRACING = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS tracingUpdate');
	db.execute('CREATE TABLE IF NOT EXISTS tracingUpdate (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT, json_images TEXT, name_images TEXT, date_update TEXT);');
	db.close();
};


exports.selectGENERAL = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	
	var res = db.execute('SELECT id, code, name, json_values FROM general WHERE code like ?', '%'+code+'%');
	var i = 0;
	var element = {
		id : null,
		code : null,
		name : null,
		values : null
	};
	var idIn;
	var codeIn;
	var nameIn;
	var valuesIn = '[';
	while (res.isValidRow()) {
		//Ti.API.error('res.fieldByName(json_values):', res.fieldByName('json_values').substring(1, res.fieldByName('json_values').length -1));
		idIn = res.fieldByName('id');
		codeIn = res.fieldByName('code');
		nameIn = res.fieldByName('name');
		valuesIn = valuesIn + res.fieldByName('json_values').substring(1, res.fieldByName('json_values').length - 1) + ',';
		i++;
		Ti.API.info('i:::', i);
		res.next();
	}
	valuesIn = valuesIn.substring(0, valuesIn.length - 1) + ']';

	element = {
		id : idIn,
		code : codeIn,
		name : nameIn,
		values : JSON.parse(valuesIn)
	};

	res.close();
	db.close();
	//Ti.API.error('code:', code);
	if (Config.mode == 0) {
		Ti.API.info('db.selectGENERAL: ' + JSON.stringify(element));
	}
	/*
	if (code == 'codeArea' || code == 'tracking') {

		var n = element.values.length;
		
		for (var i = 2; i < n; i++) {

			for (var j = 0; j < n - 1; j++) {
				if (element.values[j].ORDER > element.values[j + 1].ORDER) {
					var aux = element.values[j];
					element.values[j] = element.values[j + 1];
					element.values[j + 1] = aux;
				}
			}
		}

	}*/

	return element;
};

exports.selectTRACING = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var element;

	var res = db.execute('SELECT id, code, name, json_values, json_images, name_images FROM tracingUpdate WHERE code = ?', code);
	while (res.isValidRow()) {
		element = {
			id : res.fieldByName('id'),
			code : res.fieldByName('code'),
			name : res.fieldByName('name'),
			values : JSON.parse(res.fieldByName('json_values')),
			images : JSON.parse(res.fieldByName('json_images')),
			name_images : JSON.parse(res.fieldByName('name_images'))
		};
		res.next();
	}

	res.close();
	db.close();

	if (Config.mode == 0) {
		Ti.API.info('db.selectTRACING: ' + JSON.stringify(element));
	}

	return element;
};

exports.checkMOVIMIENTOS = function( tipo, id) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var element;

	var res = db.execute('SELECT id, tipo, id_in, json_values, date_in FROM movimientos_dash WHERE id_in = ? AND tipo = ?', id, tipo);
	while (res.isValidRow()) {
		return true;
		res.next();
	}

	res.close();
	db.close();

	return false;
};

exports.insertMOVIMIENTOS = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.insertMOVIMIENTOS: ' + JSON.stringify(params));
	}
	var dateUpdate = new Date().getTime();

	db.execute('INSERT INTO movimientos_dash (tipo, id_in, json_values, date_in) VALUES (?,?,?,?)', params['tipo'], params['id_in'], JSON.stringify(params['data']), dateUpdate);

	db.close();
};

//TODO: delete de movimientos con una semana de antiguedad

exports.selectTRACINGDate_Update = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var element;

	var res = db.execute('SELECT date_update FROM tracingUpdate WHERE code = ?', code);
	while (res.isValidRow()) {
		element = {
			date_update : res.fieldByName('date_update')
		};
		res.next();
	}

	res.close();
	db.close();

	if (Config.mode == 0) {
		Ti.API.info('db.selectTRACINGDate_Update: ' + JSON.stringify(element));
	}

	return element;
};

exports.selectASYNCTRACING = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var data = [];

	var res = db.execute('SELECT id, code, name, json_values, json_images , name_images, date_update FROM tracingUpdate ORDER BY id LIMIT 5');
	while (res.isValidRow()) {
		var element = {
			id : res.fieldByName('id'),
			code : res.fieldByName('code'),
			name : res.fieldByName('name'),
			values : JSON.parse(res.fieldByName('json_values')),
			images : JSON.parse(res.fieldByName('json_images')),
			name_images : JSON.parse(res.fieldByName('name_images')),
			date_update : JSON.parse(res.fieldByName('date_update'))
		};
		data.push(element);
		res.next();
	}

	res.close();
	db.close();

	var async = {
		data : data
	};

	if (Config.mode == 0) {
		Ti.API.info('db.selectASYNCTRACING: ' + JSON.stringify(async));
	}

	return async;
};

exports.insertGENERAL = function (params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	//Ti.API.info('db.getFile().size():', JSON.stringify(db));
	/*
	for (var index in lista_trackingUC) {

		varvalues[count] = lista_trackingUC[index];
		count = count + 1;
		if (count == 3000 || index == lista_trackingUC.length - 1) {
			Ti.API.error('Un Insert');
			params = {
				code : varcode,
				name : varname,
				values : varvalues
			};
			db.insertGENERAL(params);

			params = [];
			varcode = 'tracking';
			varname = '';
			varvalues = [];
			count = 0;
		}
	}*/

	if (Config.mode == 0) {
		Ti.API.info('db.insertGENERAL: ' + JSON.stringify(params));
	}
	var count = 0;
	var newParams = [];
	var i = 1;
	//if (params['values'].length > 3000)
	for (var index in params['values'])
	{
		newParams[count] = params['values'][index];
		count = count + 1;
		if (count == 3000 || index == params['values'].length - 1) {

			db.execute('INSERT INTO general (code, name, json_values) VALUES (?,?,?)', params['code']+i, params['name'], JSON.stringify(newParams));
			newParams = [];
			i++;
			count = 0;
		}

	}
	
	

	db.close();

	return true;
	
};

exports.insertTRACING = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.insertTRACING: ' + JSON.stringify(params));
	}
	db.execute('DELETE FROM tracingUpdate WHERE code = ?', params['code']);
	var dateUpdate = new Date().getTime();

	db.execute('INSERT INTO tracingUpdate (code, name, json_values, json_images, name_images, date_update) VALUES (?,?,?,?,?,?)', params['code'], params['name'], JSON.stringify(params['values']), JSON.stringify(params['images']), JSON.stringify(params['name_images']), dateUpdate);

	db.close();
};

exports.insertTRACINGPercentage = function(params) {
	//TODO
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.insertTRACINGPercentage: ' + JSON.stringify(params));
	}

	db.execute('DELETE FROM tracingUpdate WHERE code = ?', params['code']);
	var dateUpdate = new Date().getTime();
	db.execute('INSERT INTO tracingUpdate (code, name, json_values, json_images, name_images, date_update) VALUES (?,?,?, ?, ?,?)', params['code'], params['name'], JSON.stringify(params['values']), '[]', '[]', dateUpdate);

	db.close();
};

exports.updateGENERAL = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.updateGENERAL: ' + JSON.stringify(params));
	}
	
	var count = 0;
	var newParams = [];
	//if (params['values'].length > 3000)
	var i = 1;
	
	for (var index in params['values'])
	{
		newParams[count] = params['values'][index];
		count = count + 1;
		if (count == 3000 || index == params['values'].length - 1) {
			Ti.API.error('Un update');
			db.execute('UPDATE general SET code = ?, name = ?, json_values = ? WHERE code = ?', params['code']+i, params['name'], JSON.stringify(newParams), params['code']+i);
			i++;
			newParams = [];
			count = 0;

		}

	}

	

	db.close();
};

exports.updateTRACING = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.updateTRACING: ' + JSON.stringify(params));
	}
	var dateUpdate = new Date().getTime();
	db.execute('UPDATE tracingUpdate SET code = ?, name = ?, json_values = ?, json_images = ?, name_images = ?, date_update = ? WHERE code = ?', params['code'], params['name'], JSON.stringify(params['values']), JSON.stringify(params['images']), JSON.stringify(params['name_images']), dateUpdate, params['code']);

	db.close();
};

exports.updateTRACINGPercentage = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.updateTRACINGPercentage: ' + JSON.stringify(params));
	}
	var dateUpdate = new Date().getTime();

	db.execute('UPDATE tracingUpdate SET code = ?, name = ?, json_values = ?, date_update = ? WHERE code = ?', params['code'], params['name'], JSON.stringify(params['values']), dateUpdate, params['code']);

	db.close();
};

exports.deleteGENERAL = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.deleteGENERAL: ' + JSON.stringify(code));
	}

	db.execute('DELETE FROM general WHERE code = ?', code);

	db.close();
};

exports.deleteTRACING = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.deleteTRACING: ' + JSON.stringify(code));
	}

	db.execute('DELETE FROM tracingUpdate WHERE code = ?', code);

	db.close();
};

// KEYVAL

exports.dropKEYVAL = function() {
    var db = Ti.Database.open(Config.DATABASE_NAME);
    db.execute('DROP TABLE IF EXISTS keyval');
    db.execute('CREATE TABLE IF NOT EXISTS keyval (key TEXT PRIMARY KEY, val TEXT);');
    db.close();

    if (Config.mode == 0) {
        Ti.API.warn('db.dropKEYVAL');
    }
};

exports.selectKEYVAL = function(key) {
    var db = Ti.Database.open(Config.DATABASE_NAME);

    var val = null;

    var res = db.execute('SELECT key, val FROM keyval WHERE key = ?', key);
    while (res.isValidRow()) {
        val = res.fieldByName('val');
        res.next();
    }

    res.close();
    db.close();

    if (Config.mode == 0) {
        Ti.API.info('db.selectKEYVAL: ' + key + ' => ' + val);
    }

    return val;
};

exports.insertKEYVAL = function(params) {
    var db = Ti.Database.open(Config.DATABASE_NAME);

    for (var key in params) {
        var val = params[key];

        var res = db.execute('SELECT val FROM keyval WHERE key = ?', key);

        if (res.rowCount == 0) {
            if (Config.mode == 0) {
                Ti.API.info('db.insertKEYVAL newval: ' + key + ' => ' + val);
            }

            db.execute('INSERT INTO keyval (key, val) VALUES (?,?)', key, val);
        } else {
            if (Config.mode == 0) {
                while (res.isValidRow()) {
                    val = res.fieldByName('val');
                    res.next();
                }
                Ti.API.info('db.insertKEYVAL oldval: ' + key + ' => ' + val);
            }
        }

        res.close();
    }

    db.close();
};

exports.updateKEYVAL = function(params) {
    var db = Ti.Database.open(Config.DATABASE_NAME);

    for (var key in params) {
        var val = params[key];

        if (Config.mode == 0) {
            Ti.API.info('db.updateKEYVAL: ' + key + ' => ' + val);
        }

        db.execute('UPDATE keyval SET val = ? WHERE key = ?', val, key);
    }

    db.close();
};

exports.deleteKEYVAL = function(key) {
    var db = Ti.Database.open(Config.DATABASE_NAME);

    if (Config.mode == 0) {
        Ti.API.info('db.deleteKEYVAL: ' + key);
    }

    db.execute('DELETE FROM keyval WHERE key = ?', key);

    db.close();
};

