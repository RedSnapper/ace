Normal macro 
@test(ddd,ddd,ddffddff)

Invalid
@

No Params
@test()

Literal
{| Literal @test() () , @|}

Macro With brackets
@test(ddd,ddd,dd(ffddff))

Macro With Literal
@test(ddd,{|ddd,ddffddff|})

Macro with braces
@test(ddd,ddd{dd,d})
