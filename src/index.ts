import { empty, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, catchError, filter } from "rxjs/operators";

const REPO_QUERY = "ndse_";
const GITHUB_REPO_API = "https://api.github.com/search/repositories?q=";

const JSON_PLACEHOLDER_API = "https://jsonplaceholder.typicode.com/posts";

const getForks = (forksUrl) =>
  ajax
    .getJSON(forksUrl)
    .pipe(map((response) => response))
    .subscribe((forks) => console.log(forks));

const observerGithub = ajax.getJSON(`${GITHUB_REPO_API}${REPO_QUERY}`).pipe(
  map((response: any) => response.items),
  map((repos) => {
    console.log(repos);
    return repos.map((repo) => getForks(repo.forks_url));
  }),
  catchError((error) => {
    console.log("error: ", error);
    return of(error);
  })
);

observerGithub.subscribe({
  next: (value: any) => console.log("Next:", value),
  complete: () => console.log("Complete!"),
  error: (error) => console.log("Error!", error),
});

const observerJSON = ajax.getJSON(JSON_PLACEHOLDER_API).pipe(
  map((posts) => posts),
  filter((post: any) => post.id > 30)
);

observerJSON.subscribe((post) => {
  console.log(post);
});
