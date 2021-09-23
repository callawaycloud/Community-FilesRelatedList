@IsTest
private class CommunityFilesHelperTest {
    @IsTest
    private static void getFilesOfRecord_noRecords() {
        List<ContentDocument> contentDocuments = CommunityFilesHelper.getFilesOfRecord(null);
        System.assertEquals(0, contentDocuments.size(), 'Expected an empty ContentDocument list returned.');
    }

    @IsTest
    private static void getFilesOfRecord_filesPresent() {
        Account testAccount = new Account(Name = 'Test account 1');
        insert testAccount;

        // Create a file
        ContentVersion contentVersionRecord = new ContentVersion(
            Title = 'Test',
            PathOnClient = 'Test.jpg',
            VersionData = Blob.valueOf('Test Content Data'),
            IsMajorVersion = true
        );
        insert contentVersionRecord;

        // Get details of the new file
        contentVersionRecord = [
            SELECT Id, Title, ContentDocumentId
            FROM ContentVersion
            WHERE Id = :contentVersionRecord.Id
            LIMIT 1
        ];
        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];
        System.assertEquals(documents.size(), 1);

        // Share the file with the public file record
        ContentDocumentLink cdl = new ContentDocumentLink(
            ContentDocumentId = documents[0].Id,
            LinkedEntityId = testAccount.Id,
            ShareType = 'V',
            Visibility = 'AllUsers'
        );
        insert cdl;

        Test.startTest();
        List<ContentDocument> contentDocuments = CommunityFilesHelper.getFilesOfRecord(testAccount.Id);
        Test.stopTest();
        System.assertEquals(1, contentDocuments.size(), 'Expected a ContentDocument to be returned.');
    }
}