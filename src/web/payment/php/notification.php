<?php
	include_once 'config.php';

	if(isset($_POST['notificationType']) && $_POST['notificationType'] == 'transaction')
	{		
		//$notificationCode = preg_replace('/[^[:alnum:]-]/','',$_POST["notificationCode"]);
		$notificationCode = $_POST['notificationCode'];
		
		$url = $urlPagseguro . "transactions/notifications/". $notificationCode . "?email=". $emailPagseguro . "&token=" . $tokenPagseguro;
		$ch = curl_init($url);	
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$data = curl_exec($ch);
		curl_close($ch);

		if($data == 'Unauthorized'){
			//Insira seu código avisando que o sistema está com problemas, sugiro enviar um e-mail avisando para alguém fazer a manutenção 
		
			exit;//Mantenha essa linha
		}

		$data = simplexml_load_string($data);
		// header('Content-Type: application/json; charset=UTF-8');
		// $dataJSON = json_encode($dataXML);	
		// $data = json_decode($dataJSON);


		//$sql    = "update TABELA_PAGAMENTOS set status = '{$data->status}' where codigotransacao = '{$data->code}'";
		//$query  = mysqli_query($conexao,$sql);
	}