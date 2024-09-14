export const commonConstants = {
    dynaimcTableConstants: {
        DATEKEYS: ['createdAt'],
        PRESCRIPTION_TABLE: {
            actionButtonType: '',
            removeKeys: [ ],
            orderKeys: [ ],
            renameHeaderKeys: [
                {
                    original: 'id',
                    modify: 'System Id'
                }
            ],
            actionKeys: [
                {
                    buttonType: 'edit',
                    buttonName: '',
                    isNavigate: true,
                    isModal: true,
                    navigateUrl: 'routeMaster/routes/reviewRoutes',
                    roleDeny: []
                }
            ]
        }
    }
}