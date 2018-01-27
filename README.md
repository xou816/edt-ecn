edt-ecn
=======

A tool to aggregate and filter calendars for [Centrale Nantes](https://www.ec-nantes.fr/). Calendars are served as JSON or ICS.

You can find it here: [edt-ecn.herokuapp.com](https://edt-ecn.herokuapp.com).

Development
-----------

A Redis server is used for calendar aliases.

```
npm install
docker run -p 6379:6379 redis # or locally installed redis
npm run watch # compile typescript sources
npm start
```

The app is deployed on Heroku.

Editor tool
-----------

The app comes with a simple form-based editor to create links to filtered calendars as described further down.

Additionally, students can authenticate using their LDAP credentials to create an aliased url for their calendar. [No password is stored](/src/ldap.ts).

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
[
	{
		"start": "2017-11-11T05:00:00.000Z",
		"end": "2017-11-11T22:00:00.000Z",
		"subject": "",
		"full_subject": "",
		"location": "",
		"description": "",
		"organizer": ""
	}
]
```

Calendars can also be retrieved by their name (e.g. `AP_2` is `g305`), but it is slower (it requires reading the index of all calendars to map the name to an identifier).

```
/api/calendar/:name.ics
```

### Calendar filtering

Courses can be filtered in calendars. Calendar filtering is done __on the fly__, no information is saved in any database.

The parameter `id` above can be much more complex, and include a filter. Here is one such filter.

```
/api/calendar/custom/g305-8g_f62c05.ics
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
/api/calendar/custom/g304+g305-8g_f62c05.ics
```

Calendars are separated by a `+`. Filtered and unfiltered calendars can be aggregated.

Finding a free room
-------------------

A utility to search for a free room (WIP).

```
/api/freeroom/:from/:to
```

Parameters are UNIX timestamps.