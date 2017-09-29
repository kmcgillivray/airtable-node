const base = require('airtable').base(process.env.BASE_ID);

class Crud {
  constructor(table, { resultKey = 'result', queryKey = 'id' } = {}) {
    this.table = table;
    this.resultKey = resultKey;
    this.queryKey = queryKey;
  }

  // Find a single record by ID
  findOne(){
    return (req, res, next) => {
      console.log(req.params);
      base(this.table).find(req.params[this.queryKey], (err, record) => {
        if (err) { console.error(err); return; }
        console.log('Retrieved', record.get('Name'));
        req[this.resultKey] = record;
        next();
      });
    }
  }

  /* Find records for table
  
  Pass in an options object to change settings:
  * fields
  * filterByFormula
  * maxRecords
  * pageSize
  * sort
  
  See Airtable documentation for details */
  find(options) {
    return (req, res, next) => {
      base(this.table).select(options).eachPage((records, fetchNextPage) => {
        // This function (`page`) will get called for each page of records.
        records.forEach(record => {
          console.log('Retrieved', record.get('Name'));
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
        req[this.resultKey] = records;
        next();

      }, (err) => {
        if (err) { console.error(err); return; }
      });
      
      
    }
  }

  // Create a new record
  // To use, create a form with the input fields matching the record fields
  create() {
    return (req, res, next) => {
      base(this.table).create(req.body, function(err, record) {
        if (err) { console.error(err); return; }
        console.log(record.getId());
        req[this.resultKey] = record;
        next();
      });
    }
  }

  // Edit a record
  // To use, create a form with the input fields matching the record fields
  update() {
    return (req, res, next) => {
      base(this.table).update(req.params[this.queryKey], req.body, function(err, record) {
        if (err) { console.error(err); return; }
        console.log(record.getId());
        req[this.resultKey] = record;
        next();
      });
    }
  }
}

module.exports = Crud;