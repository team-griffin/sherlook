# sherlook
Sherlook is a cli tool that allows you to do snapshot testing of any urls.

```
npm install -g sherlook

sherlook refresh # populate snapshots

sherlook test # compare snapshots against the current state
```

## commands
### refresh
Creates snapshots for all of your tests. These should be committed to your repository.

> Note that if you attempt to run the snapshot tests before creating the initial snapshots, you will get an error

### test
For all of your tests, compares the current url with the original snapshot. If there is a difference between the two snapshots, the test will fail.

Additionally, when a test fails, a diff file will be created in a `diff` sub folder of your snapshots directory. This allows you to check what exactly has changed between tests.

## CLI options
The following options can be supplied to both `refresh` and `test`:

| Option      | Alias | Description                          | Default            |
| ----------- | ----- | ------------------------------------ | ------------------ |
| `--config`  | `-c`  | Specify the path to a config file    | `./.sherlookrc.js` |
| `--verbose` | `-v`  | Adds additional logging information  | `false`            |
| key         |       | A specific test to run/refresh       |                    |

```
sherlook test --verobse --config my-config-file.js "some-test-key"
```

## config file
The config file holds all of the information about your tests. By default, sherlook looks for a `.sherlookrc.js` file at the root of your project.
```js
{
  baseUrl: string,
  outputDirectory: string,
  tests: Array<{
    key: string,
    url: string,
    threshold: number,
    viewport: Object,
  }>,
  threshold: number,
  loglevel: string,
  key: string,
  viewport: Object,
}
```
### baseUrl
A url to prepend to all of your tests
```js
{
  baseUrl: 'http://localhost/',
  tests: [
    {
      key: 'A',
      url: 'relative-url',
    },
  ],
}
```

### outputDirectory
Where to store all of your snapshots relative to the project root

### tests
An array containing tests to run
#### key
A unique key for the test. This is used both for logging, and as the basis for the snapshot file name.

#### url
The url of the snapshot.

#### threshold
The percentage required for two images to match. i.e. a threshold of `80` would pass if the images were 80+% alike.

#### viewport
Lets you set the browser's viewport: width, height, scale factor, etc. All of the available options can be found [here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetviewportviewport)

### threshold
A standard threshold. If a test does not contain its own threshold, it will fall back to this value. If no threshold is provided, it defaults to 80.

### loglevel
The logging level. Can either be `error`, `warn`, `info`, `debug`. Defaults to `warn`.

### key
Limits the running of tests to a specific key

### viewport
Sets the global viewport if a test-specific one has not been provided.
