$("#cep").blur(function () {
    var cep = $(this).val().replace(/\D/g, '');

    if (cep != "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            $("#address").val("...");
            $("#address_complement").val("...");
            $("#address_number").val("...");
            $("#address_districtname").val("...");
            $("#address_city").val("...");
            $("#address_state").val("...");

            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                if (!("erro" in dados)) {
                    if (dados.logradouro != "") {
                        $("#address").val(dados.logradouro).attr("readonly", true);
                    } else {
                        $("#address").val("").attr("readonly", false);
                    }

                    if (dados.bairro != "") {
                        $("#address_districtname").val(dados.bairro).attr("readonly", true);
                    } else {
                        $("#address_districtname").val("").attr("readonly", false);
                    }

                    if (dados.localidade != "") {
                        $("#address_city").val(dados.localidade).attr("readonly", true);
                    } else {
                        $("#address_city").val("").attr("readonly", false);
                    }

                    if (dados.uf != "") {
                        $("#address_state").val(dados.uf);
                        $("#sel-address_state option[value=" + dados.uf + "]").attr('selected', true);
                    } else {
                        $("#sel-address_state option[value='']").attr('selected', false);
                    }

                    $("#address_complement").val("");
                    $("#address_number").val("");
                } //end if.
                else {
                    $("#address").val("").attr("readonly", false);
                    $("#address_complement").val("").attr("readonly", false);
                    $("#address_number").val("").attr("readonly", false);
                    $("#shippingAddressDistrict").val("").attr("readonly", false);
                    $("#address_city").val("").attr("readonly", false);
                    $("#address_state").val("").attr("disabled", false);
                    $("#cep").next("invalid-feedback").show();
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulario_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulario_cep();
    }
});