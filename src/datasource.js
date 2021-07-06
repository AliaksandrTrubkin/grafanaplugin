import _ from "lodash";
import "moment";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.headers = {'Content-Type': 'application/json'};
    this.headers.Authorization = this.getAuthorization(instanceSettings.jsonData);
  }

  query(options) {
    var targets = this.buildQueryParameters(options);

    if (targets.length <= 0) {
      return this.q.when({data: []});
    }

    return this.doRequest({
      url: this.url + '/grafana/query',
      data: targets,
      method: 'POST'
    });
  }

  testDatasource() {
    return this.doRequest({
      url: this.url + '/grafana/heartbeat',
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "TDengine Data source is working", title: "Success" };
      }
    });
  }

  doRequest(options) {
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options).then(function(res) {
      res.data = _.map(res.data, function(data) {
        let target = _.find(options.data, { refId: data.refId });
        if (_.isObject(target.timeshift)) {
          data.datapoints = _(data.datapoints).map(datapoint => {
            const unit2millis = {
              seconds: 1000,
              minutes: 60 * 1000,
              hours: 60 * 60 * 1000,
              days: 24 * 60 * 60 * 1000,
              weeks: 7 * 24 * 60 * 60 * 1000,
              months: 30 * 24 * 60 * 60 * 1000,
            };
            datapoint[1] += target.timeshift.period * unit2millis[target.timeshift.unit];
            return datapoint
          }).value();
          return data;
        }
        return data;
      });
      return res;
    });
  }

  buildQueryParameters(options) {

    var targets = _.map(options.targets, target => {
      return {
        refId: target.refId,
        alias: this.generateAlias(options, target),
        sql: this.generateSql(options, target),
        timeshift: target.timeshift
      };
    });

    return targets;
  }

  encode(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }

    return output;
  }

  getAuthorization(jsonData){
    jsonData = jsonData || {};
    var defaultUser = jsonData.user || "root";
    var defaultPassword = jsonData.password || "taosdata";

    return "Basic " + this.encode(defaultUser + ":" + defaultPassword);
  }

  generateTimeshift(options, target){
    var alias = target.alias || "";
    alias = this.templateSrv.replace(alias, options.scopedVars, 'csv');
    return alias;
  }
  generateAlias(options, target){
    var alias = target.alias || "";
    alias = this.templateSrv.replace(alias, options.scopedVars, 'csv');
    return alias;
  }

  generateSql(options, target) {
    var sql = target.sql;
    if (sql == null || sql == ""){
      return sql;
    }

    var queryStart = "now-1h";
    if (options != null && options.range != null && options.range.from != null){
      queryStart = options.range.from.toISOString();
    }

    var queryEnd = "now";
    if (options != null && options.range != null && options.range.to != null){
      queryEnd = options.range.to.toISOString();
    }
    var intervalMs = options.intervalMs || "20000";

    intervalMs += "a";
    sql = sql.replace(/^\s+|\s+$/gm, '');
    sql = sql.replace("$from", "'" + queryStart + "'");
    sql = sql.replace("$begin", "'" + queryStart + "'");
    sql = sql.replace("$to", "'" + queryEnd + "'");
    sql = sql.replace("$end", "'" + queryEnd + "'");
    sql = sql.replace("$interval", intervalMs);

    sql = this.templateSrv.replace(sql, options.scopedVars, 'csv');
    return sql;
  }
  metricFindQuery(query, options) {
  	// query like 'select  name  from dbtest.t;'
    const targets = [
      {
        alias: "",
        refId: "A",
        sql: query,
      },
    ];
    let req = {
      url: this.url + "/grafana/query",
      data: targets,
      method: "POST",
    };
    return this.doRequest(req).then((res) => {
      let tempList = [];
      (Array.isArray(res.data) ? res.data : []).forEach((item) => {
        (Array.isArray(item.datapoints) ? item.datapoints : []).forEach(
          (end) => {
            tempList.push({
              expendable: false,
              text: end[0],
              value: end[0],
            });
          }
        );
      });
      return Array.from(new Set(tempList));
    });
  }

}
