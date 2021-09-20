# Image-Repository
Built an image repository.

## Getting Started

The following contains the steps required to get the application up and running on your local workspace. To check out the available endpoints, visit the [documentation.](https://documenter.getpostman.com/view/15869686/UUxtEqCX)

### Prerequisites

- Node v15.14.0
- npm v7.9.0
- Git v2.32.0

### Running locally

To run the app locally, follow the steps below:

1. Clone the repository to your PC using your terminal. For more info, refer to this [article](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

2. After cloning, navigate into the repo using:

   ```
   cd IMAGE-REPOSITORY

   ```

3. Install the dependencies in the package.json using the command:

   ```
   npm install
   ```

4. After the dependencies have been installed successfully, create a .env file at the root. Take a look at the env.sample file and configure your environment variables with your values in the .env file.


## Writing Tests

**NOTE**: All test files should have a `.test.ts` file extension.

All tests for a route or controller should be placed in a `_tests_` folder relative to the folder it resides in.

For example, if you had a `authController.ts` file located in `controllers/auth`, and your tests are in a `authController.test.ts` file, do the following:

1. Create a `_tests_` folder in the `controllers/auth` folder

2. Move the `authController.test.ts` file to the `_tests_` folder

3. To run test

   ```
   npm run test
   ```


The file structure would look similar to this:

```
.
├── controllers
│   └── auth
│       ├── authController.ts
│       └── _tests_
│           └── authController.test.ts
```
