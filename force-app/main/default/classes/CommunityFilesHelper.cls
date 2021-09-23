public with sharing class CommunityFilesHelper {
    @AuraEnabled
    public static List<ContentDocument> getFilesOfRecord(Id recordId) {
        List<ContentDocument> contentDocuments = new List<ContentDocument>();

        try {
            return getContentDocumentsOfRecordIds(new List<Id>{ recordId });
        } catch (Exception e) {
            System.debug(e.getMessage());
        }

        return contentDocuments;
    }

    private static List<ContentDocument> getContentDocumentsOfRecordIds(List<Id> recordIds) {
        List<ContentDocumentLink> contentDocumentLinks = [
            SELECT Id, ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId IN :recordIds
            WITH SECURITY_ENFORCED
        ];

        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink cdl : contentDocumentLinks) {
            contentDocumentIds.add(cdl.ContentDocumentId);
        }

        return [
            SELECT
                Id,
                Title,
                ContentSize,
                Description,
                FileExtension,
                FileType,
                LatestPublishedVersionId,
                ContentModifiedDate
            FROM ContentDocument
            WHERE Id IN :contentDocumentIds
            WITH SECURITY_ENFORCED
            ORDER BY ContentModifiedDate DESC
        ];
    }
}