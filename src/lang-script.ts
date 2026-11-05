// A plain inline script for the head of every page. It runs before the page paints and loads
// nothing, so it does not count against what brumate ships.
//
// - A visitor without a saved choice gets the language of the browser: Tagalog for tl and fil,
//   English otherwise.
// - A click on a link with `hreflang`, such as the language switch, saves that language and
//   keeps the query string, so a search stays when the language changes.
// - On a full page load, a page in the other language replaces itself with the saved one.
//   Links inside the site keep their language, so client navigation needs no check.

const base = JSON.stringify(import.meta.env.BASE_URL);

export const LANG_SCRIPT = `<script>(function(){var b=${base};function en(p){var r=p.slice(b.length);return r==='en'||r.indexOf('en/')===0}function save(l){try{localStorage.setItem('lang',l)}catch(e){}}document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[hreflang]');if(!a)return;save(a.getAttribute('hreflang'));a.search=location.search},true);var s=null;try{s=localStorage.getItem('lang')}catch(e){}if(s!=='tl'&&s!=='en')s=/^(tl|fil)\\b/i.test(navigator.language)?'tl':'en';var p=location.pathname;var on=en(p)?'en':'tl';if(s===on||p.indexOf(b)!==0)return;var rest=on==='en'?p.slice(b.length+3).replace(/^\\//,''):p.slice(b.length);location.replace(b+(s==='en'?'en/':'')+rest+location.search+location.hash)})()</script>`;
