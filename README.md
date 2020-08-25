
# ITP Cookies & storage Proof of Concept

#### This is a PoC of how to cope with Browser making stricter rules for cross origin resources

 Cookies for cross-site resources are now blocked by default across the board. This is a significant improvement for privacy since it removes any sense of exceptions or “a little bit of cross-site tracking is allowed.

 - https://webkit.org/blog/8124/introducing-storage-access-api/
 - https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
 - chrome to implement sometime  q2 2021 - q1 2022

## Itelligent Tracking Prevention: what is it?
  Intelligent Tracking Prevention is a Standard, that has been launched around 2017 to prevent cross site tracking via Cookies.
  ITP 2.2 mainly includes:
 - [x] No third-party cookies allowed
 - [x] 30-day retention for first-party cookies
 - [x] All cookies purged after 30 days
 - [x] Client-side cookies blocked after 7 days.
 - [x] client-side cookies are to be blocked after 1 day if:
       - The user accessed the site from a cross-site link.
       - The final URL the user navigated to contains query strings and fragment id.
` `

 -  [Read more about ITP](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/)

## Custom StoreJS + Storage Access API: our Solution

We use a custom version of the popular *_StoreJS_* but expanded it with more custimization and security options, such as alowing to set Secure cookies by default, having the options to customize the `SameSite` attribute as wel as setting a `Max-Age` rather than `Expires`.

This will be be our default solution for most of the client swide data, in certain cases we may   need to use the Storage Acces API though.

The *_JS Storage Access API_* is a relatively new API still in beta to allow third Party sites to request storage access via user-action and a popup of some sorts, this however is not the recommended way. Below you can see example usage of this new API.

### Storage Access API Request Example
    var promise = document.hasStorageAccess();
    promise.then(
        function (hasAccess) {
            // Boolean hasAccess says whether the document has access or not.
        },
        function (reason) {
            // Promise was rejected for some reason.
        }
    );

 -  [Read more about Storage Access API](https://webkit.org/blog/8124/introducing-storage-access-api/)

 ## Other Solutions:
  [OAuth 2.0 Authorization](https://tools.ietf.org/html/rfc6749) with which the authenticating domain (in your case, the third-party that expects cookies) forwards an authorization token to your website which you consume and use to establish a first-party login session with a [server-set Secure and HttpOnly cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies).
