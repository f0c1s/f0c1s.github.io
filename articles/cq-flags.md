## Why not pass boolean parameters?

Flags are used to signal from afar; think in olden days, how would you signal a defeat or success from battlefield in a war. A white flag from a batallion in a remote warzone would signal the warring generals, and based on the camp they belong, strategy and subsequent action would change. Your party’s (country, kabal, group) flag on top would signal different meaning.

In code world, boolean params are called flags, flags are used to take different code paths based on the value. More often than not, it is a shortcut attempt at DRY. Flags make it easy for code to do wildly different things based on value at runtime. It also increases complexity and reduces readability which hinders maintainability.


## What should you do instead?

You already know the value of boolean param, instead of passing it down, call different functions.

## Example frontend

[https://github.com/appsmithorg/appsmith/blob/7c77d3fb7c38fb69eed5082ca5dafbbd8eb006be/app/client/src/pages/Editor/gitSync/Tabs/GitConnection.tsx#L156](https://github.com/appsmithorg/appsmith/blob/7c77d3fb7c38fb69eed5082ca5dafbbd8eb006be/app/client/src/pages/Editor/gitSync/Tabs/GitConnection.tsx#L156)

```jsx
function GitConnection({ isImport }: Props) {
...
}
```

This `isImport` flag was implemented on assumption that import and connect features will look and behave similarly in future because at that point in time that was correct.

The problem for future maintainers would be that now import and connect are married together. The code is DRY, but it remember DRY is lowest form of code-reuse. Due to its dryness, the unintended effect is of high coupling. Two entirely different flows are joined by that flag now.

You might ask, but that’s not so bad, it’s just one flag.

No it is not. Because of this one flag, the rest of the flow will be littered with `isImport` checks, the strings, the UI components and whatnot. It might not be that bad right now, but watch out, it’s going to get uglier from here.

The solution, don’t let DRY be the only principle in your coding life. There are better ones, SOLID and GRASP. Well, GRASP are not principles per se.

Now, you might ask, how will I ever call GitConnection or GitImport (if it existed)?

Well you are getting `isImport` from somewhere, you’d call from there.

```jsx
isImport ? <GitConnection /> : <GitImport />
```

## Example backend

[https://github.com/appsmithorg/appsmith/blob/d727d66c175a911b467b73803f3767e0943da7da/app/server/appsmith-server/src/main/java/com/appsmith/server/services/ce/GitServiceCEImpl.java#L1342](https://github.com/appsmithorg/appsmith/blob/d727d66c175a911b467b73803f3767e0943da7da/app/server/appsmith-server/src/main/java/com/appsmith/server/services/ce/GitServiceCEImpl.java#L1342)

```java
private Mono<Application> publishAndOrGetApplication(String applicationId, boolean publish) {
    if (Boolean.TRUE.equals(publish)) {
        return applicationPageService.publish(applicationId, true)
                // Get application here to decrypt the git private key if present
                .then(getApplicationById(applicationId));
    }
    return getApplicationById(applicationId);
}
```

Here, the flag `publish` makes the function do entirely different thing based on its value.

The function is `publish the application and get the application by id and/or just get the application by id`. This should sound wrong. The solve here is way too easy.

```java
private void publishApplication(String applicationId) {
	applicationPageService.publish(applicationId);
}
/*
private Mono<Application> getApplication(String applicationId) {
    return getApplicationById(applicationId);
}
*/
```

Notice that `applicationPageService.publish` had a flag too. Don’t need it. When you `publish`, mean it.

Notice that you don’t need other function, because that can be replaced by existing `getApplicationById(applicationId);`

We can do better. Notice that you don’t need `publishApplication` too. You can just call `applicationPageService.publish(applicationId);`.

There, code made so much simpler to follow by removing coupling.

If you think for a minute, we also ended up following S of SOLID and achieved LC of GRASP.

## Conclusion

- Just don’t pass boolean values as parameters.
- Make functions do one thing they’re supposed to.
- DRY principle may lead to highly coupled code.
- Truth be told, use your judgement and don’t follow any principle blindly.
    - There are a lot of moving parts in a software’s code, when in doubt, wait to think.

## Comments

If you are talking about something like feature-flags, then too don’t pass feature flags to functions/modules. Keep them in global area, provide interface to access from functionality, and let the individual function/module take care of implmentation.

```jsx

global = { isGitEnabled: true, isRbacEnabled: false }
getIsGitEnabled = () => {} //...

/* other file */
function GitConnect() {
    const isEnabled = getIsGitEnabled()
    //...
    return isEnabled && ({ ... })
}

/* other file */
function RoleManager() {
    const isRbacEnabled = getIsRbacEnabled()
    const isGitEnabled = getIsGitEnabled()
    // ...
    return isRbacEnabled && (
    // ...
        isGitEnabled && ({someGitSettings})
    )
}

```
Point is, don’t pass flags. Find other ways to achieve same result. If you must, then do. Exceptions further define the rule.
