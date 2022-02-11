# Files Related List

A simple component that is used in Experience Cloud to view files of a record that are shared with community users.

This component could be dropped anywhere in a Salesforce community to show files pertaining to a record.

![Imgur](https://i.imgur.com/X6Jzax4.png)
![Imgur](https://i.imgur.com/iEqQ8N5.png)

## 📦 Install

**via sfdx-cli**
`sfdx force:package:install --package 04t5e000000aOQrAAM -u your@org.user`

**via url**
login and navigate to [`/packaging/installPackage.apexp?p0=04t5e000000aOQrAAM`](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5e000000aOQrAAM). Choose `Install for: Admin Only`.

## 🔨 Usage

1. Add the clas ``CommunityFilesHelper`` to the profile/permission set being used in the community
2. Go to your community in Experience cloud
3. Go to any page and drag the component ``Files Related List`` onto the page
4. For the component's parameters, specify the Id of the record whose related files you want to display

## ✨Features

### Ability to toggle uploading files

- Specify in the Experience Builder if you want to allow community users to upload files

### Download on click

- When you click on the title of the file, the file will be automatically downloaded

### Sorting

- Community users have the ability to sort the title and last modified columns by default


** Powered by ** [Callaway Cloud Consulting](https://www.callawaycloud.com/)