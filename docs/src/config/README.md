# Config

Configuration for SDK initialization.

```javascript
initLivetag({
  shopUri: '{shopUri}',
  autoplaySharedSessions: true,
});

// or

Livetag.init({
  shopUri: '{shopUri}',
  autoplaySharedSessions: true,
});
```

## shopUri

- Type: `string`
- Default: empty
- Required: true

Specify Shop URI.

## autoplaySharedSessions

- Type: `boolean`
- Default: true
- Required: false

Responsible for automatic widget opening when Shared Livestream is opened. To disable this behavior, set the parameter to `false`.
