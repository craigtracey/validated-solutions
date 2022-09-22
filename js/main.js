var pageStoreObject = JSON.parse(pageStoreJson);

loadFirstPage();

function loadFirstPage() {
	var firstTopicAnchor = document.getElementById("first-topic-anchor-id");
	var onClick = firstTopicAnchor["onclick"];
	onClick.call();
}

function loadPage(pageName) {
	var page = pageStoreObject.find(x => x.Key === pageName);
	
	document.title = page.Title;
	
	var pageHeading = document.getElementById("page-heading-id");
	pageHeading.innerHTML = page.Title;
	
	var contentDiv = document.getElementById("content-div-id");
	contentDiv.innerHTML = page.Content;

	loadRightToc(page.Content);
}

function loadRightToc(content) {
	const regex = /<h(?<HEADING_TYPE>[23]) id="(?<ID_VALUE>.*)">/gm;
	const matches = content.matchAll(regex);

	var rightTocDiv = document.getElementById("right-toc-div-id");
	rightTocDiv.innerHTML = null;

	for (const match of matches) {
		var headingType = match.groups["HEADING_TYPE"];
		var headingId = match.groups["ID_VALUE"];

		var headingElement = document.getElementById(headingId);

		if (headingElement) {
			var spanElement = document.createElement("span");
			spanElement.innerText = headingElement.innerText;

			var anchorElement = document.createElement("a");
			anchorElement.href = "#" + headingId;

			if (headingType === "2") {
				anchorElement.classList.add("d-flex", "justify-content-between", "h2-collapsible");
			}
			else {
				anchorElement.classList.add("drop-down-content");
				anchorElement.style.display = "block";
            }

			anchorElement.appendChild(spanElement);
			rightTocDiv.appendChild(anchorElement);
        }		
	}	
}

function toggleExpand(element) {
	if (element.classList.contains("icon-topic-collapse")) {
		var targetUl = element.parentElement.getElementsByTagName("ul")[0];

		if (targetUl.style.display === 'none') {
			element.classList.remove("fa-angle-right");
			element.classList.add("fa-angle-down");
			targetUl.style.display = 'block';
		}
		else {
			element.classList.remove("fa-angle-down");
			element.classList.add("fa-angle-right");
			targetUl.style.display = 'none';
		}
    }	
}

function expandAll() {
	var expandAllElement = document.getElementById("expand-all-id");
	var collapseAllElement = document.getElementById("collapse-all-id");
	var tocRootUlElement = document.getElementById("toc-root-ul-id");

	expandAllElement.classList.add("hide");
	collapseAllElement.classList.remove("hide");

	var allUlElements = tocRootUlElement.getElementsByTagName("ul");

	for (const ulElement of allUlElements) {
		ulElement.style.display = 'block';
	}

	var allCollapsibleIconElements = tocRootUlElement.getElementsByClassName("icon-topic-collapse");

	for (const collapsibleIconElement of allCollapsibleIconElements) {
		collapsibleIconElement.classList.remove("fa-angle-right");
		collapsibleIconElement.classList.add("fa-angle-down");
	}
}

function collapseAll() {
	var expandAllElement = document.getElementById("expand-all-id");
	var collapseAllElement = document.getElementById("collapse-all-id");
	var tocRootUlElement = document.getElementById("toc-root-ul-id");

	collapseAllElement.classList.add("hide");
	expandAllElement.classList.remove("hide");

	var allUlElements = tocRootUlElement.getElementsByTagName("ul");

	for (const ulElement of allUlElements) {
		ulElement.style.display = 'none';
	}

	var allCollapsibleIconElements = tocRootUlElement.getElementsByClassName("icon-topic-collapse");

	for (const collapsibleIconElement of allCollapsibleIconElements) {
		collapsibleIconElement.classList.remove("fa-angle-down");
		collapsibleIconElement.classList.add("fa-angle-right");
    }
}