Normal macro 
@test(ddd,ddd,ddffddff)

Invalid
@

No Params
@test()

Comment
@comment(dddd)

Internal Macro
@iLink(ddd,ddd)

Markup macro
@wLi(,)

Literal
{| Literal @test() () , @|}

Braces
{ddd}

Macro With brackets
@test(ddd,ddd,dd(ffddff))

Macro With Literal
@test(ddd,{|ddd,ddffddff|})

Macro with braces
@test(ddd,ddd{dd,d})

Macro with everything
@test(dd,{dd,dd},{|ddd|},@test(ddd),(dddd),@)

{|{|}

Macro multiline

@test(dd,
	{dd,dd},
	{|ddd|},
	@test(ddd),
	(dddd),
@)

@iRegex((()))








