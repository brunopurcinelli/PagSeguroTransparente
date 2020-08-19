<?php
	include_once 'config.php';

    function xml_boleto($cartId, $produtos, $valor, $nome, $sobrenome, $cpf, $ddd, $telefone, $email, $senderHash, $endereco, $numero, $complemento, $bairro, $cep, $cidade, $estado) {
      return "<payment>
      <mode>default</mode>
      <currency>BRL</currency>
      <notificationURL>" . $notificationURL . "</notificationURL>
      <receiverEmail>" . $emailPagseguro . "</receiverEmail>
      <sender>
        <hash>". $senderHash . "</hash>
        <ip>" . $_SERVER['REMOTE_ADDR'] . "</ip>
        <email>". $email . "</email>
        <documents>
          <document>
            <type>CPF</type>
            <value>" . $cpf . "</value>
          </document>
        </documents>
        <phone>
          <areaCode>" . $ddd . "</areaCode>
          <number>" . $telefone . "</number>
        </phone>
        <name>" . $nome." ".$sobrenome . "</name>
      </sender>
      <items>" . $produtos . "</items>
      <reference>" . $cartId . "</reference>
      <shipping>
        <address>
          <street>" . $endereco . "</street>
          <number>" . $numero . "</number>
          <complement>" . $complemento . "</complement>
          <district>" . $bairro . "</district>
          <city>" . $cidade . "</city>
          <state>" . $estado . "</state>
          <country>BRA</country>
          <postalCode>" . $cep . "</postalCode>
        </address>
        <type>1</type>
        <cost>0.00</cost>
        <addressRequired>true</addressRequired>
      </shipping>
      <extraAmount>0.00</extraAmount>
      <method>boleto</method>
      <dynamicPaymentMethodMessage>
        <creditCard>infoEnem</creditCard>
        <boleto>infoEnem</boleto>
      </dynamicPaymentMethodMessage>
    </payment>";

    }

    function xml_cartao($cartId, $produtos, $valor, $nome, $sobrenome, $cpf, $ddd, $telefone, $email, $senderHash, $endereco, $numero, $complemento, $bairro, $cep, $cidade, $estado, $enderecoPagamento, $numeroPagamento, $complementoPagamento, $bairroPagamento, $cepPagamento, $cidadePagamento, $estadoPagamento, $cardToken, $holdCardNome, $holdCardCPF, $holdCardNasc, $holdCardArea, $holdCardFone, $parcelas, $valorParcelas) {
      return "<payment>
      <mode>default</mode>
      <currency>BRL</currency>
      <notificationURL>" . $notificationURL . "</notificationURL>
      <receiverEmail>" . $emailPagseguro . "</receiverEmail>
      <sender>
        <hash>". $senderHash . "</hash>
        <ip>" . $_SERVER['REMOTE_ADDR'] . "</ip>
        <email>". $email . "</email>
        <documents>
          <document>
            <type>CPF</type>
            <value>" . $cpf . "</value>
          </document>
        </documents>
        <phone>
          <areaCode>" . $ddd . "</areaCode>
          <number>" . $telefone . "</number>
        </phone>
        <name>" . $nome." ".$sobrenome . "</name>
      </sender>
      <creditCard>
        <token>". $cardToken ."</token>
        <holder>
          <name>" . $nome." ".$sobrenome . "</name>
          <birthDate>" . $holdCardNasc ."</birthDate>
            <documents>
              <document>
                <type>CPF</type>
                <value>" . $cpf . "</value>
              </document>
            </documents>
          <phone>
            <areaCode>" . $ddd . "</areaCode>
            <number>" . $telefone . "</number>
          </phone>
        </holder>
        <billingAddress>
            <street>" . $endereco . "</street>
            <number>" . $numero . "</number>
            <complement>" . $complemento . "</complement>
            <district>" . $bairro . "</district>
            <city>" . $cidade . "</city>
            <state>" . $estado . "</state>
            <postalCode>" . $cep . "</postalCode>
            <country>BRA</country>
        </billingAddress>
        <installment>
          <quantity>" . $parcelas . "</quantity>
          <value>" . $valorParcelas . "</value>
          <noInterestInstallmentQuantity>2</noInterestInstallmentQuantity>
        </installment>
      </creditCard>
      <items>" . $produtos . "</items>
      <reference>" . $cartId . "</reference>
      <shipping>
        <address>
          <street>" . $endereco . "</street>
          <number>" . $numero . "</number>
          <complement>" . $complemento . "</complement>
          <district>" . $bairro . "</district>
          <city>" . $cidade . "</city>
          <state>" . $estado . "</state>
          <country>BRA</country>
          <postalCode>" . $cep . "</postalCode>
        </address>
        <type>1</type>
        <cost>0.00</cost>
        <addressRequired>true</addressRequired>
      </shipping>
      <extraAmount>0.00</extraAmount>
      <method>creditCard</method>
      <dynamicPaymentMethodMessage>
        <creditCard>infoEnem</creditCard>
        <boleto>infoEnem</boleto>
      </dynamicPaymentMethodMessage>
    </payment>";
    }
