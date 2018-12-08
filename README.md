edt-ecn
=======

A API + React app to aggregate and filter calendars for [Centrale Nantes](https://www.ec-nantes.fr/). Calendars are served as JSON or ICS.

You can find it here: [edt-ecn.herokuapp.com](https://edt-ecn.herokuapp.com).

Docker usage
------------

### Build

Using a build image for the client:

```
cd client
docker build -f Dockerfile.build -t edt-ecn-build-client .
docker run --rm -e PUBLIC='http://localhost' -v $PWD/src:/var/app/src -v $PWD/build/:/var/app/build edt-ecn-build-client:latest
```

The `PUBLIC` variable has to be adapted.

Same for the API:

```
cd api
docker build -f Dockerfile.build -t edt-ecn-build-api .
docker run --rm -v $PWD/src:/var/app/src -v $PWD/build/:/var/app/build edt-ecn-build-api:latest
```

Build the actual image (with a proper tag for Heroku):

```
# from root folder
docker build -t registry.heroku.com/edt-ecn/web -f Dockerfile.web .
```

### Run

To run it on port 80, proceed as such (create a network, start a Redis container):

```
docker network create edt
docker run --network edt --name myredis -d redis
docker run -p 80:3000 --network edt -e REDISTOGO_URL='http://redis:@myredis:6379' registry.heroku.com/edt-ecn/web:latest
```

The `REDISTOGO_URL` variable is used by Heroku, but can be used to work locally with a Redis container (required).

Development
-----------

You need to have a Redis instance running locally (`locahost:6379`).

### API

```
npm run build
npm start
```

Alternatively, run Typescript in watch mode when developping (you will still have to restart the API manually).

```
npm run watch
npm start
```

### Client

If building and running locally, set the `PUBLIC` environment variable so that it matches where you client will run (`http://localhost:3000` by default).

Build the Express app (proxies API calls to the actual API + performs SSR):
```
npm run build-back
```

Build the frontend with Webpack:
```
export PUBLIC=http://localhost:3000
npm run build-front
```

Run the frontend with live-reload:
```
npm run dev
```

Run the Express app:
```
npm run start
```

Aggregated and filtered calendars
---------------------------------

### Calendar formats

The original calendars are found [here](http://website.ec-nantes.fr/sites/edtemps/finder.xml). Each calendar has a unique identifier, which can be used to retrieve it using the API :

```
/api/calendar/custom/:id.ics
```

or 

```
/api/calendar/custom/:id
```

for the JSON version, which looks like this:

```
{
    "meta": [
        {
            "id": "g999",
            "filter": [
                1, 2, 3
            ],
            "valid": true
        }
    ],
    "version": "version_one",
    "events": [
        {
            "id": "2522",
            "colour": "#7FFF7F",
            "start": "2025-09-04T06:00:00.000Z",
            "end": "2025-09-04T08:00:00.000Z",
            "subject": "SUBJECT",
            "full_subject": "Subject but Fancier",
            "location": "R217",
            "description": "...",
            "organizer": "teacher@ec-nantes.fr",
            "calendar": "g999",
            "category": "CM"
        }
    ]
}
```

Calendars can also be retrieved by their name (e.g. `AP_2` is `g305`), but it is slower (it requires reading the index of all calendars to map the name to an identifier).

```
/api/calendar/:name.ics
```

### Calendar filtering

Courses can be filtered in calendars. Calendar filtering is done __on the fly__, no information is saved in any database.

The parameter `id` above can be much more complex, and include a filter. Here is one such filter.

```
/api/calendar/custom/g305-8g-f62c05.ics
```

The `id` takes the form `[actual id]-[filter]-[filter checksum]`.

The filter is a base 32 encoded binary number (here: `100010000`). If the _n_-th bit is on, then the _n_-th subject associated with the calendar will be hidden.

The actual order of subjects is given here:

```
/api/calendar/custom/:id/subjects
```

Since new subjects may be added over time, some precautions are in order. Because we do not store anything, we have to make sure this order is relatively stable, even as new subjects are added; otherwise, the filter could accidentally hide new subjects from the calendar.

Therefore, the ordering of subjects is done so that subjects that show up first in the calendar are given a low index; later added subjects are therefore __likely__ to end up with a high index (this might not always be the case, a course could be planned from day one to happen at the very end of the year for instance).

The second mitigation of potential filtering issue is the __checksum__. It is built from the names of the _m_ first courses of the calendar, where _m_ is the maximal power of 2 found in the filter. In the example above, _m_ = 8. As a consequence, if a new subject is added among the _m_ first subjects (and would change the filtered subjects by introducing an offset), the checksum would change. If this happens (invalid checksum), __filters are ignored__, and a message is appended to the body of events.

### Calendar aggregation

Multiple calendars can be aggregated.

```
/api/calendar/custom/g304+g305-8g-f62c05.ics
```

Calendars are separated by a `+`. Filtered and unfiltered calendars can be aggregated.

Finding a free room
-------------------

A utility to search for a free room (WIP).

```
/api/freeroom/:from/:to
```

Parameters are UNIX timestamps.