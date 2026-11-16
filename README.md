# resource-reservations

## Overview

resource-reservations centralizes an organization's catalog of shared resources and reservations for specific time slots. Resources can include meeting rooms, vehicles, and equipment.

The project is under development. Its intended workflow lets clients request resources for a time slot, staff manage reservations, and administrators maintain the catalog, categories, and users.

## Repository Structure

| Application | Responsibility | Setup guide |
| --- | --- | --- |
| API | Authentication, data management, and reservation rules. | [API README](resource-reservations-api/README.md) |
| Web | User interface for resource-reservations, including authentication and role-based navigation. | [Web README](resource-reservations-web/README.md) |

## Getting Started

Clone the repository and enter its root directory:

```sh
git clone https://github.com/BryanJCuellar/resource-reservations.git
cd resource-reservations
```

1. Follow the [API guide](resource-reservations-api/README.md) to configure SQL Server and the API environment, start the API, and seed local test data.
2. Follow the [web guide](resource-reservations-web/README.md) to configure the API URL and CORS origin, start the web application, and sign in.

Keep both the API and web development servers running during local use.
