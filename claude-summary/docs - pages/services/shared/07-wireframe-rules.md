# Service Wireframe Rules

Status: **Documentation contract**

Wireframes define only:

- section order;
- grouping;
- relative prominence;
- approximate grid topology;
- content/image relationships;
- responsive stacking intent;
- presence of actions/controls.

Wireframes do not define production:

- palette;
- font family/size;
- exact spacing values;
- exact radius values;
- shadows;
- final imagery;
- component ownership;
- copy;
- data.

## Theme integration

Each service wireframe loads:

```text
../shared/wireframe-base.css
../shared/wireframe-responsive.js
```

`wireframe-base.css` imports the current generated theme CSS and uses semantic variables only.

Do not paste wireframe CSS or helper markup into production Astro components.
