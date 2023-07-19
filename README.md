# Encrypter

Encrypter is a web application that allows you to encrypt and decrypt files securely. It provides an easy-to-use interface for encrypting your sensitive data. This readme guide will walk you through the setup process and explain how to use the application effectively.

## Installation

To get started, follow these steps:

1. Open your browser and visit `localhost:3000`.
2. Make sure you have the necessary dependencies installed and configured.
3. Clone the repository to your local machine.
4. Navigate to the project directory.

## Database Setup

There are two ways to create a database for Encrypter:

1. GUI: Click on the database image in the application to create a database using the graphical user interface.
2. Manual: If you prefer, you can create the database using SQL queries. However, this method requires more technical knowledge.

To create the database manually:

1. Open the notepad file named `encrypter.txt`.
2. Modify the content of the file to match your desired database name (e.g., "encrypter").
3. Save the changes and rename the notepad file to `encrypter.sql`.
4. If you have received an `encrypter.sql` file from someone, skip this step.

If you haven't received an `encrypter.sql` file, you need to run the database migration to load the necessary data:

1. Open the command prompt.
2. Navigate to the project directory using the `cd` command.
3. Type `ls` to list the files in the directory.
4. Run the following command to migrate the database:
