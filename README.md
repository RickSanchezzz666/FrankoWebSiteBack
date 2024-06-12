> [!TIP]
> Dev deploy: amif.server24.space

# Developer Guide
Below you'll find essential information on how to contribute, manage branches, and run the project.

## Branching Strategy
We follow a branching strategy to organize our development process. Please adhere to the following conventions when working on new tasks:

+ For new features, create a new branch using the '/feature' prefix: 
```git checkout -b feature/your-feature-name```
+ For bug fixes, create a new branch using the '/fix' prefix: 
```git checkout -b fix/your-fix-name```

Make sure to create descriptive branch names that reflect the nature of the changes you're making.

## Running the Project
To run the project locally, execute the following command:
```npm run dev```

This command will start the necessary processes and launch the project.

> [!TIP]
> Make sure to install the required dependencies using npm install before running the project.

## Sensitive Information
> [!CAUTION]
> Please note that the .env file and the logs folder contain sensitive information. Therefore, sharing or committing them to the repository is strictly prohibited. Ensure these files are added to the project's .gitignore to prevent accidental inclusion in version control.