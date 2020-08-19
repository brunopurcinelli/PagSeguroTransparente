$.ajax({
    type: 'GET',
    url: 'payment/php/get-session.php',
    cache: false,
    success: function (data) {
        PagSeguroDirectPayment.setSessionId(data);
    }
});

$(function () {

    $("#cardnumber").focusout(function () {
        brandCard();
    });

    $("#creditButton").click(function (e) {
        e.preventDefault();
        paym_card();
    });

    $("#boletoButton").click(function (e) {
        e.preventDefault();
        paym_boleto();
    });

    /*###########################################################################*/
    function brandCard() {
        let cardNumber = $("#cardnumber").val().replace(" ", "").replace(" ", "").replace(" ", "");
        PagSeguroDirectPayment.getBrand({
            cardBin: cardNumber,
            success: function (response) {
                $("#creditCardBrand").val(response.brand.name);
                $("#cardnumber").css('border', '1px solid #999');

                if (response.brand.cvvSize > 0) {
                    $("#cvc").css('display', 'block');
                } else {
                    $("#cvc ").css('display', 'none');
                }

                //$("#bandeiraCartao").attr('src', 'https://stc.pagseguro.uol.com.br/public/img/payment-methods-flags/68x30/' + response.brand.name + '.png');
                $("#bandeiraCartao").attr('src', 'https://stc.pagseguro.uol.com.br/public/img/payment-methods-flags/42x20/' + response.brand.name + '.png');

                parcelasDisponiveis();
            },
            error: function (response) {
                $("#cardnumber").css('border', '2px solid red');
                $("#cardnumber").focus();
                $("#modal-body").append(response.errorDetails);
                $('.modal').modal('show');
            },
            complete: function (response) {
                console.log(response);
            }
        });
    }

    function parcelasDisponiveis() {
        PagSeguroDirectPayment.getInstallments({
            amount: (($("#totalValue").html()).replace(",", ".")), 
            brand: $("#creditCardBrand").val(),
            maxInstallmentNoInterest: 2,

            success: function (response) {
                $("#installmentsWrapper").css('display', "block");

                var installments = response.installments[$("#creditCardBrand").val()];

                var options = '';
                for (var i in installments) {
                    var optionItem = installments[i];
                    var optionQuantity = optionItem.quantity;
                    var optionAmount = optionItem.installmentAmount;
                    var optionLabel = (optionQuantity + " x R$ " + (optionAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(".", ',')));

                    options += ('<option value="' + optionItem.quantity + '" valorparcela="' + optionAmount + '">' + optionLabel + '</option>');
                };

                $("#installmentQuantity").html(options);
            },

            error: function (response) {
                console.log(response);
            },
            complete: function (response) {
                console.log(response);
            }
        });
    }

    function paym_card(senderHash) {

        let cardNumber = $("#cardnumber").val().replace(" ", "").replace(" ", "").replace(" ", "");
        let expireMonth = $("#expireCard").val().split(' / ')[0];
        let expireYear = "20" + $("#expireCard").val().split(' / ')[1];
        let productsXml = "";

        var produtos = $(".product");
        var total = 0;
        var subtotal = 0;
        var id = 0;
        $(produtos).each(function (pos, produto) {
            id++;
            var $produto = $(produto);
            var desc = $produto.find(".product_desc").data("product_desc");
            var quantity = $produto.find(".product_qty").text();
            var price = $produto.find(".product_amount").text();
            subtotal = quantity * price;
            total += subtotal;
            subtotal = (subtotal < 1 ? "0" : "") + Math.floor(subtotal * 100);
            subtotal = subtotal.substr(0, subtotal.length - 2) + "." + subtotal.substr(-2)

            productsXml += "<item><id>" + id + "</id><description>" + desc + "</description><amount>" + subtotal + "</amount><quantity>" + quantity + "</quantity></item>";
        });
        var text = (total < 1 ? "0" : "") + Math.floor(total * 100)
        total = text.substr(0, text.length - 2) + "," + text.substr(-2);

        PagSeguroDirectPayment.createCardToken({
            cardNumber: cardNumber,
            brand: $("#creditCardBrand").val(),
            cvv: $("#cvc").val(),
            expirationMonth: expireMonth,
            expirationYear: expireYear,

            success: function (response) {
                $("#creditCardToken").val(response.card.token);

                $.ajax({
                    type: 'POST',
                    url: 'payment/php/paym-card.php',
                    cache: false,
                    data: {
                        idcart: 1,
                        produtos: productsXml,
                        total : total,
                        email: $("#email").val(),
                        nome: $("#first").val(),
                        sobrenome: $("#last").val(),
                        cpf: $("#cpf").val(),
                        ddd: $("#ddd").val().replace("(", "").replace(")", ""),
                        telefone: $("#cellphone").val().replace("-",""),
                        cep: $("#cep").val(),
                        endereco: $("#address").val(),
                        numero: $("#address_number").val(),
                        complemento: $("#address_complement").val(),
                        bairro: $("#address_districtname").val(),
                        cidade: $("#address_city").val(),
                        estado: $("#address_state").val(),
                        pais: "BRA",
                        senderHash: senderHash,

                        enderecoPagamento: $("#address").val(),
                        numeroPagamento: $("#address_number").val(),
                        complementoPagamento: $("#address_complement").val(),
                        bairroPagamento: $("#address_districtname").val(),
                        cepPagamento: $("#cep").val(),
                        cidadePagamento: $("#address_city").val(),
                        estadoPagamento: $("#address_state").val(),
                        cardToken: $("#creditCardToken").val(),
                        cardNome: $("#nameCard").val(),
                        cardCPF: $("#cpf").val(),
                        cardNasc: $("#nasc").val(),
                        cardFoneArea: $("#ddd").val(),
                        cardFoneNum: $("#cellphone").val().replace("-", ""),

                        numParcelas: $("#installmentQuantity").val(),
                        valorParcelas: $("#installmentValue").val()
                    },
                    success: function (data) {
                        if (data.error) { //aqui
                            console.log(data.error);
                            if (data.error.code == "53037") {
                                $("#creditButton").click();
                            } else {
                                $.each(data.error, function (index, value) {
                                    if (value.code) {
                                        tratarError(value.code);

                                    } else {
                                        tratarError(data.error.code)
                                    }
                                })
                            }
                        } else {
                            $.ajax({
                                type: 'POST',
                                url: 'payment/php/get-status.php',
                                cache: false,
                                data: {
                                    id: data.code,
                                },
                                success: function (status) {
                                    if (status == "7") {
                                        $("#modal-body").append("Erro ao processar o seu pagamento.<br/> Não se preocupe pois esse valor <b>não será debitado de sua conta ou não constará em sua fatura</b><br><br>Verifique se você possui limite suficiente para efetuar a transação e/ou tente um cartão diferente");
                                    } else {
                                        //window.location = "http://download.infoenem.com.br/pagamento-efetuado/";
                                        $("#modal-body").append("Compra efetuada com sucesso.");
                                    }
                                    $('.modal').modal('show');
                                }
                            });
                        }
                    }
                });
            },
            error: function (response) {
                if (response.error) {
                    $.each(response.errors, function (index, value) {
                        tratarError(value);
                    });
                }
            }
        });
    }

    function paym_boleto(senderHash) {
        let productsXml = "";

        var produtos = $(".product");
        var total = 0;
        var subtotal = 0;
        var id = 0;
        $(produtos).each(function (pos, produto) {
            id++;
            var $produto = $(produto);
            var desc = $produto.find(".product_desc").data("product_desc");
            var quantity = $produto.find(".product_qty").text();
            var price = $produto.find(".product_amount").text();
            subtotal = quantity * price;
            total += subtotal;
            subtotal = (subtotal < 1 ? "0" : "") + Math.floor(subtotal * 100);
            subtotal = subtotal.substr(0, subtotal.length - 2) + "." + subtotal.substr(-2)

            productsXml += "<item><id>" + id + "</id><description>" + desc + "</description><amount>" + subtotal + "</amount><quantity>" + quantity + "</quantity></item>";
        });
        var text = (total < 1 ? "0" : "") + Math.floor(total * 100)
        total = text.substr(0, text.length - 2) + "," + text.substr(-2);

        $.ajax({
            type: 'POST',
            url: 'payment/php/paym-boleto.php',
            cache: false,
            data: {
                idcart: 1,
                produtos: productsXml,
                total: total,
                email: $("#email").val(),
                nome: $("#first").val(),
                sobrenome: $("#last").val(),
                cpf: $("#cpf").val(),
                ddd: $("#ddd").val().replace("(", "").replace(")", ""),
                telefone: $("#cellphone").val().replace("-", ""),
                cep: $("#cep").val(),
                endereco: $("#address").val(),
                numero: $("#address_number").val(),
                complemento: $("#address_complement").val(),
                bairro: $("#address_districtname").val(),
                cidade: $("#address_city").val(),
                estado: $("#address_state").val(),
                pais: "BRA",
                senderHash: senderHash
            },
            success: function (data) {
                if (!(data.paymentLink)) {
                    alert(data);
                    console.log(data.error);
                    $.each(data.error, function (index, value) {
                        if (value.code) {
                            //console.log("6 " + value.code);
                            tratarError(value.code);
                        } else {
                            //console.log("7 " + data.error);
                            tratarError(data.error.code);
                        }
                    });
                } else {
                    window.location = data.paymentLink;

                    $("#btnImprimirBoleto").attr("href", data.paymentLink).css("display", "block");
                    $("#boletoButton").hide();

                    $("#modal-body").append("Caso você não seja redirecionado para o seu boleto, clique no botão imprimir boleto.");
                    $('.modal').modal('show');
                }
            }
        });

    }

    function tratarError(id) {
        if (id.charAt(0) == '2') id = id.substr(1);
        if (id == "53020" || id == '53021') {
            $("#modal-body").append("<p>Verifique telefone inserido</p>");
            $("#cellphone").css('border', '2px solid red');

        } else if (id == "53010" || id == '53011' || id == '53012') {
            $("#modal-body").append("<p>Verifique o e-mail inserido</p>");
            $("#email").css('border', '2px solid red');

        } else if (id == "53017") {
            $("#modal-body").append("<p>Verifique o CPF inserido</p>");
            $("#cpf").css('border', '2px solid red');

        } else if (id == "53018" || id == "53019") {
            $("#modal-body").append("<p>Verifique o DDD inserido</p>");
            $("#ddd").css('border', '2px solid red');

        } else if (id == "53013" || id == '53014' || id == '53015') {
            $("#modal-body").append("<p>Verifique o nome inserido</p>");
            $("#first").css('border', '2px solid red');

        } else if (id == "53029" || id == '53030') {
            $("#modal-body").append("<p>Verifique o bairro inserido</p>");
            $("#address_districtnae").css('border', '2px solid red');

        } else if (id == "53022" || id == '53023') {
            $("#modal-body").append("<p>Verifique o CEP inserido</p>");
            $("#cep").css('border', '2px solid red');

        } else if (id == "53024" || id == '53025') {
            $("#modal-body").append("<p>Verifique a rua inserido</p>");
            $("#address").css('border', '2px solid red');

        } else if (id == "53026" || id == '53027') {
            $("#modal-body").append("<p>Verifique o número inserido</p>");
            $("#address_number").css('border', '2px solid red');

        } else if (id == "53033" || id == '53034') {
            $("#modal-body").append("<p>Verifique o estado inserido</p>");
            $("#address_state").css('border', '2px solid red');

        } else if (id == "53031" || id == '53032') {
            $("#modal-body").append("<p>Verifique a cidade informada</p>");
            $("#address_city").css('border', '2px solid red');

        } else if (id == '10001') {
            $("#modal-body").append("<p>Verifique o número do cartão inserido</p>");
            $("#cardnumber").css('border', '2px solid red');

        } else if (id == '10002' || id == '30405') {
            $("#modal-body").append("<p>Verifique a data de validade do cartão inserido</p>");
            $("#expireCard").css('border', '2px solid red');

        } else if (id == '10004') {
            $("#modal-body").append("<p>É obrigatorio informar o código de segurança, que se encontra no verso, do cartão</p>");
            $("#cvc").css('border', '2px solid red');

        } else if (id == '10006' || id == '10003' || id == '53037') {
            $("#modal-body").append("<p>Verifique o código de segurança do cartão informado</p>");
            $("#cvc").css('border', '2px solid red');

        } else if (id == '30404') {
            $("#modal-body").append("<p>Ocorreu um erro. Atualize a página e tente novamente!</p>");

        } else if (id == '53047') {
            $("#modal-body").append("<p>Verifique a data de nascimento do titular do cartão informada</p>");
            $("#nasc").css('border', '2px solid red');

        } else if (id == '53053' || id == '53054') {
            $("#modal-body").append("<p>Verifique o CEP inserido</p>");
            $("#cep").css('border', '2px solid red');

        } else if (id == '53055' || id == '53056') {
            $("#modal-body").append("<p>Verifique a rua inserido</p>");
            $("#address").css('border', '2px solid red');

        } else if (id == '53042' || id == '53043' || id == '53044') {
            $("#modal-body").append("<p>Verifique o nome inserido</p>");
            $("#nameCard").css('border', '2px solid red');

        } else if (id == '53057' || id == '53058') {
            $("#modal-body").append("<p>Verifique o número inserido</p>");
            $("#address_number").css('border', '2px solid red');

        } else if (id == '53062' || id == '53063') {
            $("#modal-body").append("<p>Verifique a cidade informada</p>");
            $("#address_city").css('border', '2px solid red');

        } else if (id == '53045' || id == '53046') {
            $("#modal-body").append("<p>Verifique o CPF inserido</p>");
            $("#cpf").css('border', '2px solid red');

        } else if (id == '53060' || id == '53061') {
            $("#modal-body").append("<p>Verifique o bairro inserido</p>");
            $("#address_districtname").css('border', '2px solid red');

        } else if (id == '53064' || id == '53065') {
            $("#modal-body").append("<p>Verifique o estado inserido</p>");
            $("#address_state").css('border', '2px solid red');

        } else if (id == '53051' || id == '53052') {
            $("#modal-body").append("<p>Verifique telefone inserido</p>");
            $("#address_state").css('border', '2px solid red');

        } else if (id == '53049' || id == '53050') {
            $("#modal-body").append("<p>Verifique o código de área informado</p>");
            $("#ddd").css('border', '2px solid red');

        } else if (id == '53122') {
            $("#modal-body").append("<p>Enquanto na sandbox do PagSeguro, o e-mail deve ter o domínio '@sandbox.pagseguro.com.br' (ex.: comprador@sandbox.pagseguro.com.br)</p>");
        }
        $('.modal').modal('show');

    }
});