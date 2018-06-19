# Create Static Site

Create a static site using the Gents Agency workflow.

## Usage

When you have `npm` >= 6 on your system, you can run

```sh
$ npm init @gentsagency/static-site my-site
```

or if you have `npm` >= 5 on your system, you can run

```sh
$ npx @gentsagency/create-static-site my-site
```

This will output:

```
👋 Creating a new static website in ~/Sites/my-site

📥 Installing dependencies & moving files around
☕️ This might take a while

🌱 All set! Let's get you started:

    cd ~/Sites/demo-project
    gulp watch

🤞 Good luck, have fun!
```

And you're good to go.

It will install a [`gulp` workflow](https://github.com/gentsagency/gulp-registry), create all necessary files & folders and configure both [`eslint`](https://github.com/gentsagency/eslint-config) and [`stylelint`](https://github.com/gentsagency/stylelint-config).
