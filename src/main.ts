import express from 'express';
import { createClient } from 'soap';

const testUrls: Record<
  string,
  { url: string; args: unknown; service: string; method: string }
> = {
  calculator: {
    url: 'http://www.dneonline.com/calculator.asmx?WSDL',
    args: { intA: 20, intB: 30 },
    service: 'Calculator',
    method: 'Add',
  },
  music: {
    url: 'http://api.chartlyrics.com/apiv1.asmx?WSDL',
    args: {
      artist: 'michael jackson',
      song: 'bad',
    },
    service: 'TempConvert',
    method: 'SearchLyricDirect',
  },
};

const app = express();

app.get('/', function (req, res) {
  const endpoint = req.query.endpoint?.toString();
  const target = testUrls[endpoint as string] || testUrls.calculator;
  console.log(`Query: ${endpoint}`);

  createClient(target.url, {}, function (err, client) {
    if (!err) {
      const services = client.describe();

      client[target.method](target.args, (err: any, result: any) => {
        res.send({
          result,
          services,
        });
      });
    } else {
      console.log(err);
      res.send({
        err,
      });
    }
  });
});

app.listen(8888);
