$(function () {
    $("#ddd").mask("(99)");
    $("#cellphone").mask("99999-9999");
    $("#cpf").mask("999.999.999-99");
    $("#cep").mask("99999-999");
    $("#expireCard").mask("99 / 99");

    calc_total();


    function calc_total() {
        var produtos = $(".product");
        var total = 0;
        $(produtos).each(function (pos, produto) {
            var $produto = $(produto);
            var quantity = $produto.find(".product_qty").text();
            var price = $produto.find(".product_amount").text();
            total += quantity * price;
        });
        var text = (total < 1 ? "0" : "") + Math.floor(total * 100)
        $("#totalValue").text("R$ "+text.substr(0, text.length - 2) + "," + text.substr(-2));
    }
}); 