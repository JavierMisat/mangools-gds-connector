function getAuthType() {
  var response = { type: 'KEY' };
  return response;
}

function isAdminUser() {
  return true;
}

function isAuthValid() {
  return true;
}

function getConfig(request) {
  var config = {
    configParams: [
      {
        type: 'SELECT_SINGLE',
        name: 'tracking_id',
        displayName: 'Media Type',
        helpText: 'Enter the media type for results',
        options: [
          {
            label: 'Desktop (default)',
            value: '5b6b164000aa762d5967bda4',
          },
          {
            label: 'Mobile',
            value: '5b6b161800aa762d5967bce2',
          },
        ],
      },
    ],
    dateRangeRequired: true
  };
  return config;
}

var dataSchema = [
  {
    name: 'keyword',
    label: 'Keyword',
    description: 'The keyword being tracked.',
    dataType: 'STRING',
    semantics: {
      semanticType: 'TEXT',
      semanticGroup: 'TEXT',
      conceptType: 'DIMENSION',
    },
  },
  {
    name: 'search_volume',
    label: 'Search Volume',
    description: 'The search volume of the keyword being tracked.',
    dataType: 'NUMBER',
    semantics: {
      semanticType: 'NUMBER',
      semanticGroup: 'NUMBER',
      conceptType: 'DIMENSION',
    },
  },
  {
    name: 'rank_last',
    label: 'Keyword Rank - Last',
    description: 'The rank of the keyword being tracked.',
    dataType: 'NUMBER',
    semantics: {
      semanticType: 'NUMBER',
      semanticGroup: 'NUMBER',
      conceptType: 'DIMENSION',
    },
  },
  {
    name: 'rank_ave',
    label: 'Keyword Rank - Average',
    description: 'The rank of the keyword being tracked.',
    dataType: 'NUMBER',
    semantics: {
      semanticType: 'NUMBER',
      semanticGroup: 'NUMBER',
      conceptType: 'DIMENSION',
    },
  },
  {
    name: 'rank_best',
    label: 'Keyword Rank - Best',
    description: 'The rank of the keyword being tracked.',
    dataType: 'NUMBER',
    semantics: {
      semanticType: 'NUMBER',
      semanticGroup: 'NUMBER',
      conceptType: 'DIMENSION',
    },
  },
  {
    name: 'rank_change',
    label: 'Keyword Rank Change',
    description: 'The rank change of the keyword being tracked since last query.',
    dataType: 'NUMBER',
    semantics: {
      semanticType: 'NUMBER',
      semanticGroup: 'NUMBER',
      conceptType: 'DIMENSION',
    },
  },
];

function getSchema(request) {
  return { schema: dataSchema };
}

function getData(request) {
  // Create schema for requested fields
  var dataSchema = [];
  var fixedSchema = getSchema().schema;
  request.fields.forEach(function(field) {
    for (var i = 0; i < fixedSchema.length; i++) {
      if (fixedSchema[i].name == field.name) {
        dataSchema.push(fixedSchema[i]);
        break;
      }
    }
  });

  // Fetch and parse data from API
  var url =
      'https://api.mangools.com/v2/serpwatcher/trackings/' +
      request.configParams.tracking_id + '?from=' +
      request.dateRange.startDate + '&to=' + request.dateRange.endDate;

  var headers = {
    accept: 'application/json',
    'x-access-token': '37f2e298b0def8ad37ea5387c1add5e2e0d1b007918caf728becf51f707efb66'
  };
  var response = UrlFetchApp.fetch(url, { headers: headers });
  var parsedResponse = JSON.parse(response);
  var keywordsArray = parsedResponse.keywords;

  // Transform parsed data and filter for requested fields
  var requestedData = keywordsArray.map(function(keyword) {
    var values = [];
    dataSchema.forEach(function (field) {
      switch (field.name) {
      case 'keyword':
        values.push(keyword.kw);
        break;
      case 'search_volume':
        values.push(keyword.search_volume);
        break;
      case 'rank_avg':
        values.push(keyword.rank.avg);
        break;
      case 'rank_best':
        values.push(keyword.rank.best);
        break;
      case 'rank_last':
        values.push(keyword.rank.last);
        break;
      case 'rank_change':
        values.push(keyword.rank_change);
        break;
      }
    });
    return { values: values };
  });

  console.log(requestedData);

  // tabulate return data
  return {
    schema: dataSchema,
    rows: requestedData
  };
}
