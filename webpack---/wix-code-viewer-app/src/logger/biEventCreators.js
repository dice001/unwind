'use strict'

const userCodeLoaded = ({
    pageId
}) => ({
    evid: 133,
    worker_id: pageId
})
const active$wSiteViewMode = ({
    isPopup,
    isServerSide,
    pageId,
    pageNumber,
    pageUrl,
    tsn
}) => ({
    evid: 136,
    worker_id: pageId,
    is_lightbox: isPopup,
    isServerSide,
    pn: pageNumber,
    page_url: pageUrl,
    tsn
})
const active$wPreviewMode = ({
    pageNumber,
    pageUrl,
    tsn
}) => ({
    evid: 239,
    pn: pageNumber,
    pageurl: pageUrl,
    tsn
})

module.exports = {
    userCodeLoaded,
    active$wSiteViewMode,
    active$wPreviewMode
}