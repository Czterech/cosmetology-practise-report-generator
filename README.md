# Foobar
Script should be used for generating practise reports for cosmetology students

## Installation

```bash
npm install
```

## Prerequisites
Prepare `.env` file based on schema from `.end.dist` and if you wish update rows of `resources/sample.xlsx` file
##### Example .env:

```
EXCEL_PATH=/resources/sample.xlsx
WORKING_DAYS=0;8;8;8;6;8;8
START_DAY=2022-04-07
END_DAY=2022-07-07
DAYS_OFF=2022-05-11;2022-06-02;2022-06-03
HOURS_ON_DAY=8
TOTAL_HOURS_TO_WORK=560
RES_FILE_PATH=res.pdf
```

## Run
```
npm start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)