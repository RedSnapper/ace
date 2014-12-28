ace.define("ace/snippets/builder",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Internal macros\n\
snippet append \n\
	@iAppend(${1:~var},${0})\n\
snippet ap\n\
	@iAppend(${1:~var},${0})\n\
snippet birth\n\
	@iBirth(${1:NODEREF},${2:COMPARISON},${3:TRUE},${4:FALSE})\n\
snippet console\n\
	@iConsole(${1:e|i|t|n|w},${2:MESSAGE})${0}\n\
snippet co\n\
	@iConsole(${1:e|i|t|n|w},${2:MESSAGE})${0}\n\
snippet content\n\
	@iContent(${1:NODEREF},${2:SEGNAME},${3:[METADATA]})${0}\n\
snippet date\n\
	@iDate(${1:DATE},${2:FORMAT},${3:COMPARATOR},${4:[TRUE]},${5:[FALSE]})${0}\n\
snippet death\n\
	@iDeath(${1:NODEREF},${2:COMPARISON},${3:TRUE},${4:FALSE})${0}\n\
snippet decode\n\
	@iDecode(${0:CONTENT})\n\
snippet digest\n\
	@iDigest(${1:CONTENT},${2:md4|md5|mdc3|sha1|sha256|sha384|sha512|dss1|ripemd160})${0}\n\
snippet embed\n\
	@iEmbed(${1:REF},${2:[META]})${0}\n\
snippet eq\n\
	@iEq(${1:A},${2:B},${3:TRUE},${4:FALSE})\n\
snippet eqfamily\n\
	@iEqFamily(${1:TEST-NODE},${2:FAMILY-NODE},${3:TRUE},${4:FALSE})\n\
snippet eqf\n\
	@iEqFamily(${1:TEST-NODE},${2:FAMILY-NODE},${3:TRUE},${4:FALSE})\n\
snippet eqnode\n\
	@iEqNode(${1:NODE-A},${2:NODE-B},${3:TRUE},${4:FALSE})\n\
snippet eqn\n\
	@iEqNode(${1:NODE-A},${2:NODE-B},${3:TRUE},${4:FALSE})\n\
snippet eqsibs\n\
	@iEqSibs(${1:NODE-A},${2:NODE-B},${3:TRUE},${4:FALSE})\n\
snippet eval\n\
	@iEval(${1:CONTENT},${2:CONTENT})${0}\n\
snippet existcontent\n\
	@iExistContent(${1:NODE},${2:SEGMENT},${3:TRUE},${4:FALSE})\n\
snippet exc\n\
	@iExistContent(${1:NODE},${2:SEGMENT},${3:TRUE},${4:FALSE})\n\
snippet existmedia\n\
	@iExistMedia(${1:REF},${2:TRUE},${3:FALSE})\n\
snippet exm\n\
	@iExistMedia(${1:REF},${2:TRUE},${3:FALSE})\n\
snippet exnode\n\
	@iExistNode(${1:REF},${2:TRUE},${3:FALSE})\n\
snippet exn\n\
	@iExistNode(${1:REF},${2:TRUE},${3:FALSE})\n\
snippet existsimilar\n\
	@iExistSimilar(${1:REF},${2:TRUE},${3:FALSE})\n\
snippet exists\n\
	@iExists(${1:VAR},${2:TRUE},${3:FALSE})\n\
snippet ex\n\
	@iExists(${1:VAR},${2:TRUE},${3:FALSE})\n\
snippet forancestry\n\
	@iForAncestry(${1:STARTNODE},${2:DIRECTION(F|R)},${3:TERMINATION-POINT},${4:PATTERN},\n\
		${0}\n\
	)\n\
snippet fora\n\
	@iForAncestry(${1:STARTNODE},${2:DIRECTION(F|R)},${3:TERMINATION-POINT},${4:PATTERN},\n\
		${0}\n\
	)\n\
snippet fornodes\n\
	@iForNodes(${1:LIST},${2:\\$NODE\\$},${3:\\$NODE\\$},${4:SORT},\n\
		${0}\n\
	)\n\
snippet forn\n\
	@iForNodes(${1:LIST},${2:\\$NODE\\$},${3:\\$NUM\\$},${4:SORT},\n\
		${0}\n\
	)\n\
snippet forpeers\n\
	@iForPeers(${1:NODE},${2:TERMINATION-POINT},${3:\\$NODE\\$},${4:\\$NUM\\$},${5:SORT},\n\
		${0}\n\
	)\n\
snippet forp\n\
	@iForPeers(${1:NODE},${2:TERMINATION-POINT},${3:\\$NODE\\$},${4:\\$NUM\\$},${5:SORT},\n\
		${0}\n\
	)\n\
snippet forsibs\n\
	@iForSibs(${1:NODE},${2:\\$NODE\\$},${3:\\$NUM\\$},\n\
		${0}\n\
	)\n\
snippet fors\n\
	@iForSibs(${1:NODE},${2:\\$NODE\\$},${3:\\$NUM\\$},\n\
		${0}\n\
	)\n\
snippet forsimilar\n\
	@iForSimilar(${1:NODE},${2:\\$NODE\\$},${3:SCORE-PATTERN},${4:TAX-ROOT},${5:DIRECTION},\n\
		${0}\n\
	)\n\
snippet fortax\n\
	@iForTax(${1:NODE},${2:TAX-ROOT},${3:\\$NODE\\$},\n\
		${0}	\n\
	)\n\
snippet fortaxnodes\n\
	@iForTaxNodes(${1:TAX-NODE},${2:\\$NODE\\$},${3:\\$NUM\\$},${4:SORT},\n\
		${0}\n\
	)\n\
snippet get\n\
	@iGet(~${1:VAR})\n\
snippet hex\n\
	@iHex(${1:CONTENT},${2:${2:[COMPARATOR,TRUE,FALSE]}})${0}\n\
snippet id\n\
	@iID(${1:NODE})${0}\n\
snippet lang\n\
	@iLang(${1:${2:[COMPARATOR,TRUE,FALSE]}})${0}\n\
snippet langid\n\
	@iLangID(${1:${2:[COMPARATOR,TRUE,FALSE]}})${0}\n\
snippet layout\n\
	@iLayout(${1:NODE},${2:COMPARATOR},${3:TRUE},${4:FALSE})\n\
snippet la\n\
	@iLayout(${1:NODE},${2:COMPARATOR},${3:TRUE},${4:FALSE})\n\
snippet layoutname\n\
	@iLayoutName(${1:NODE},${2:[COMP,TRUE,FALSE]})${0}\n\
snippet left\n\
	@iLeft(${1:INPUT},${2:OFFSET},${3:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet length\n\
	@iLength(${1:INPUT},${2:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet link\n\
	@iLink(${1:NODE[:OFFSET]})${0}\n\
snippet linkref\n\
	@iLinkRef(${1:NODE},${2:${2:[COMPARATOR,TRUE,FALSE]}})${0}\n\
snippet lower\n\
	@iLower(${1:STRING},${2:[COMPARATOR,TURE,FALSE]})${0}\n\
snippet math\n\
	@iMath(${1:-|*|x|m|L|G|=|f|c|Rf|R|Rx},${2:INPUT1},${3:INPUT2},${4:COMP},${5:TRUE},${6:FALSE})${0}\n\
snippet media\n\
	@iMedia(${1:MEDIAREF},${2:[META]})${0}\n\
snippet mid\n\
	@iMid(${1:STRING},${2:OFFSET},${3:SIZE},${4:[COMP,T,F]})\n\
snippet index\n\
	@iIndex(${1:DELIMITER},${2:LIST},${3:normalise|size|find|resize|get|set|ifempty|erase|push|append|pop|drop|reverse},${4:[PARM1,PARM2]})\n\
snippet null\n\
	@iNull(${1:CONTENT})${0}\n\
snippet numchildren\n\
	@iNumChildren(${1:NODE},${2:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet numc\n\
	@iNumChildren(${1:NODE},${2:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet numgen\n\
	@iNumGen(${1:NODE},${2:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet numg\n\
	@iNumGen(${1:NODE},${2:${2:[COMPARATOR,TRUE,FALSE]}})\n\
snippet numgens\n\
	@iNumGens(${1:[COMPARATOR,TRUE,FALSE]})\n\
snippet numpage\n\
	@iNumPage(${1:[COMPARATOR,TRUE,FALSE]})\n\
snippet nump\n\
	@iNumPage(${1:[COMPARATOR,TRUE,FALSE]})\n\
snippet numpages\n\
	@iNumPages(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})\n\
snippet numsib\n\
	@iNumSib(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})\n\
snippet nums\n\
	@iNumSib(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})\n\
snippet position\n\
	@iPosition(${1:HAYSTACK},${2:NEEDLE},${3:[COMPARATOR,TRUE,FALSE]})\n\
snippet pos\n\
	@iPosition(${1:HAYSTACK},${2:NEEDLE},${3:[COMPARATOR,TRUE,FALSE]})\n\
snippet preview\n\
	@iPreview(${1:PREVIEW},${2:LIVE})\n\
snippet pr\n\
	@iPreview(${1:PREVIEW},${2:LIVE})\n\
snippet regex\n\
	@iRegex(${1:NEEDLE},${2:REPLACE},${3:HAYSTACK})${0}\n\
snippet reg\n\
	@iRegex(${1:NEEDLE},${2:REPLACE},${3:HAYSTACK})${0}\n\
snippet rembr\n\
	@iRembr(${1:CONTENT})${0}\n\
snippet rembrp\n\
	@iRembrp(${1:CONTENT})${0}\n\
snippet replace\n\
	@iReplace(${1:NEEDLE},${2:REPLACE},${3:HAYSTACK})${0}\n\
snippet rep\n\
	@iReplace(${1:NEEDLE},${2:REPLACE},${3:HAYSTACK})${0}\n\
snippet reset\n\
	@iReset(${1:VARIABLE})${0}\n\
snippet res\n\
	@iReset(${1:VARIABLE})${0}\n\
snippet right\n\
	@iRight(${1:INPUT},${2:OFFSET},${3:[COMPARATOR,TRUE,FALSE]})\n\
snippet segmentname\n\
	@iSegmentName(${1:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet set\n\
	@iSet(~${1:VAR},${0:VALUE})\n\
snippet setcache\n\
	@iSetCache(${1:VARIABLE},${0:VALUE})\n\
snippet sig\n\
	@iSig(${1:VARIABLE},${2:TRUE},${3:FALSE})\n\
snippet shorttitle\n\
	@iShortTitle(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet stitle\n\
	@iShortTitle(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet suffix\n\
	@iSuffix(${1:NODE:OFFSET},${2:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet tax\n\
	@iTax(${1:NODE},${2:META},${3:[COMPARATOR,TRUE,FALSE]})\n\
snippet team\n\
	@iTeam(${2:NODE},${2:[COMPARATOR,TRUE,FALSE]})\n\
snippet tech\n\
	@iTech(${1:[COMPARATOR,TRUE,FALSE]})\n\
snippet timing\n\
	@iTiming(${1:MODE})\n\
snippet title\n\
	@iTitle(${1:NODE},${2:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet urlencode\n\
	@iUrlEncode(${1:CONTENT})${0}\n\
snippet unhex\n\
	@iUnHex(${1:CONTENT},${2:[COMPARATOR,TRUE,FALSE]})${0}\n\
snippet upper\n\
	@iUpper(${1:CONTENT},${2:[COMPARATOR,TRUE,FALSE]})\n\
snippet use\n\
	@iUse(${1:VARIABLE})${0}\n\
\n\
#HTML\n\
snippet wa\n\
	@wa(${1},${0})\n\
snippet wa+\n\
	@wa(${1},${2}) wa+${0}\n\
snippet data\n\
	@wa(data-${1},${0})	\n\
snippet href\n\
	@wa(href,${0})\n\
snippet src\n\
	@wa(src,${0})\n\
# Elements\n\
snippet .\n\
	@wDiv(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet a\n\
	@wA(@wa(href,${1}),${0})\n\
snippet a.\n\
	@wA(@wa(class,${1})@wa(href,${2}),${0})\n\
snippet article\n\
	@wArticle(${1},\n\
		${0}\n\
	)\n\
snippet article.\n\
	@wArticle(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet aside\n\
	@wAside(${1},\n\
		${0}\n\
	)\n\
snippet aside.\n\
	@wAside(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet blockquote\n\
	@wBlockquote(${1},\n\
		${0}\n\
	)\n\
snippet blockquote.\n\
	@wBlockquote(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet button\n\
	@wButton(${1},${0})\n\
snippet button.\n\
	@wButton(@wa(class,${1}),${0})\n\
snippet dd\n\
	@wDd(${1},${0})\n\
snippet dd.\n\
	@wDd(@wa(class,${1}),${0})\n\
snippet div\n\
	@wDiv(${1},\n\
		${0}\n\
	)\n\
snippet div.\n\
	@wDiv(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet dl\n\
	@wDl(${1},\n\
		${0}\n\
	)\n\
snippet dl.\n\
	@wDl(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet dl+\n\
	@wDl(,\n\
		@wDt(,${1})\n\
		@wDd(,${2})\n\
		dt+${0}\n\
	)	\n\
snippet dt\n\
	@wDt(${1},${0})\n\
snippet dt.\n\
	@wDt(@wa(class,${1}),${0})	\n\
snippet dt+\n\
	@wDt(,${1})\n\
	@wDd(,${2})\n\
	dt+${0}\n\
snippet em\n\
	@wEm(${1},${0})\n\
snippet em.\n\
	@wEm(@wa(class,${1}),${0})		\n\
snippet fieldset\n\
	@wFieldset(${1},\n\
		${0}\n\
	)\n\
snippet fieldset.\n\
	@wFieldset(@wa(class,${1}),\n\
		${0}\n\
	)		\n\
snippet footer\n\
	@wFooter(${1},\n\
		${0}\n\
	)\n\
snippet footer.\n\
	@wFooter(@wa(class,${1}),\n\
		${0}\n\
	)		\n\
snippet form\n\
	@wForm(@wa(action,${1})@wa(method,${2}),\n\
		${0}\n\
	)\n\
snippet form.\n\
	@wForm(@wa(class,${1})@wa(action,${2})@wa(method,${3}),\n\
		${0}\n\
	)		\n\
snippet h1\n\
	@wH1(${1},${0})\n\
snippet h1.\n\
	@wH1(@wa(class,${1}),${0})\n\
snippet h2\n\
	@wH2(${1},${0})\n\
snippet h2.\n\
	@wH2(@wa(class,${1}),${0})\n\
snippet h3\n\
	@wH3(${1},${0})\n\
snippet h3.\n\
	@wH3(@wa(class,${1}),${0})\n\
snippet h4\n\
	@wH4(${1},${0})\n\
snippet h4.\n\
	@wH4(@wa(class,${1}),${0})\n\
snippet h5\n\
	@wH5(${1},${0})\n\
snippet h5.\n\
	@wH5(@wa(class,${1}),${0})\n\
snippet header\n\
	@wHeader(${1},\n\
		${0}\n\
	)\n\
snippet header.\n\
	@wHeader(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet hgroup\n\
	@wHgroup(${1},\n\
		${0}\n\
	)\n\
snippet hgroup.\n\
	@wHgroup(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet hr\n\
	@wHr(${1},\n\
		${0}\n\
	)\n\
snippet hr.\n\
	@wHr(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet i\n\
	@wI(${1},\n\
		${0}\n\
	)\n\
snippet i.\n\
	@wI(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet iframe\n\
	@wIframe(${1},\n\
		${0}\n\
	)\n\
snippet iframe.\n\
	@wIframe(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet img\n\
	@wImg(@wa(src,${1})@wa(alt,${0}))\n\
snippet img.\n\
	@wImg(@wa(src,${1})@wa(alt,${2})@wa(class,${0}))\n\
snippet input\n\
	@wInput(@wa(type,${1})@wa(value,${0}))\n\
snippet input.\n\
	@wInput(@wa(type,${1})@wa(value,${2})@wa(class,${0}))\n\
snippet label\n\
	@wLabel(${1},${0})\n\
snippet label.\n\
	@wLabel(@wa(class,${1}),${0})\n\
snippet legend\n\
	@wLegend(${1},${0})\n\
snippet legend.\n\
	@wLegend(@wa(class,${1}),${0})\n\
snippet li\n\
	@wLi(${1},\n\
		${0}\n\
	)\n\
snippet li.\n\
	@wLi(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet li+\n\
	@wLi(,${1})\n\
	li+${0}\n\
snippet label\n\
	@wLabel(${1},\n\
		${0}\n\
	)\n\
snippet label.\n\
	@wLabel(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet nav\n\
	@wNav(${1},\n\
		${0}\n\
	)\n\
snippet nav.\n\
	@wNav(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet ol\n\
	@wOl(${1},\n\
		${0}\n\
	)\n\
snippet ol.\n\
	@wOl(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet p\n\
	@wP(${1},\n\
		${0}\n\
	)\n\
snippet p.\n\
	@wP(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet opt\n\
	@wOption(${1},${0})\n\
snippet section\n\
	@wSection(${1},\n\
		${0}\n\
	)\n\
snippet section.\n\
	@wSection(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet select\n\
	@wSelect(${1},\n\
		${0}\n\
	)\n\
snippet select.\n\
	@wSelect(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet small\n\
	@wSmall(${1},${0})\n\
snippet small.\n\
	@wSmall(@wa(class,${1}),${0})\n\
snippet source\n\
	@wSource(@wa(src,${1})@wa(type,${2})@wa(media,${0}))\n\
snippet span\n\
	@wSpan(${1},${0})\n\
snippet span.\n\
	@wSpan(@wa(class,${1}),${0})\n\
snippet strong\n\
	@wStrong(${1},${0})\n\
snippet strong.\n\
	@wStrong(@wa(class,${1}),${0})\n\
snippet table\n\
	@wTable(${1},\n\
		${0}\n\
	)\n\
snippet table.\n\
	@wTable(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet tbody\n\
	@wtTbody(${1},\n\
		${0}\n\
	)\n\
snippet tbody.\n\
	@wTbody(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet td\n\
	@wTd(${1},\n\
		${0}\n\
	)\n\
snippet td.\n\
	@wTd(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet td+\n\
	@wTd(,${1})\n\
	td+${0}	\n\
snippet textarea\n\
	@wTextarea(${1},\n\
		${0}\n\
	)\n\
snippet textarea.\n\
	@wTextarea(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet tfoot\n\
	@wTfoot(${1},\n\
		${0}\n\
	)\n\
snippet tfoot.\n\
	@wTfoot(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet th\n\
	@wTh(${1},${0})\n\
snippet th.\n\
	@wTh(@wa(class,${1}),${0})\n\
snippet th+\n\
	@wTh(,${1})\n\
	th+${0}\n\
snippet thead\n\
	@wThead(${1},\n\
		${0}\n\
	)\n\
snippet thead.\n\
	@wThead(@wa(class,${1}),\n\
		${0}\n\
	)\n\
snippet time\n\
	@wTime(${1},${0})\n\
snippet time.\n\
	@wTime(@wa(class,${1}),${0})\n\
snippet ul\n\
	@wUl(${1},${0})\n\
snippet ul.\n\
	@wUl(@wa(class,${1}),${0})\n\
snippet video\n\
	@wVideo(@wa(src,${1})@wa(height,${2})@wa(width,${3})@wa(preload,${4})@wa(autoplay,${5:autoplay}),${0})\n\
snippet video.\n\
	@wVideo(@wa(src,${1})@wa(height,${2})@wa(width,${3})@wa(preload,${4})@wa(autoplay,${5:autoplay})@wa(class,${0}),${7})\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
\n\
";
exports.scope = "builder";

});
