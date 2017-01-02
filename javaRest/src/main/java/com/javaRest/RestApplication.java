package com.javaRest;

import common.Person;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@RestController
public class RestApplication implements CommandLineRunner {

    List<Person> people;

    @Autowired
    Sender sender;

	public static void main(String[] args) {
		SpringApplication.run(RestApplication.class, args);
	}

	@RequestMapping("/greet")
	public String helloGreeting() {
		return "Hello REST";
	}
    @RequestMapping(value = "/api/people", method = RequestMethod.GET)
    public List<Person> getAll(){
        return people;
    }

    @RequestMapping(value = "/api/send", method = RequestMethod.GET)
    public void send(){
        System.out.println("Sending...");
        sender.send(people.get(0));

       // sender.send("Hello!");
//        for (Person p: people){
//            sender.send(p);
//        }
    }

    @RequestMapping(value = "/api/people/{id}" , method = RequestMethod.GET)
    public Person get(@PathVariable int id){
        Person person=null;
        for (Person p:people) {
            if(id == p.getId()){
                person=p;
                sender.send(p);
            }
        }
	    return person;
    }

	@Override
    public void run(String... strings) throws Exception {
        people = new ArrayList<>();
        people.add(new Person(1, "John","Doe",15));
        people.add(new Person(2,"Jane","Doe",17));
        people.add(new Person(3,"John","Smith",34));
        for (Person p :people) {
            System.out.println(p);
        }
    }
}
@Component
class Sender {

    @Bean
    public MappingJackson2MessageConverter jackson2Converter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        return converter;
    }

    @Autowired
    RabbitMessagingTemplate rabbitMessagingTemplate;

    @Autowired
    private MappingJackson2MessageConverter mappingJackson2MessageConverter;

//    @Autowired
//    Sender(RabbitMessagingTemplate template){
//        this.template = template;
//    }
    @Bean
    Queue queue() {
        return new Queue("TestQ", false,false,true);
    }

    public void send(Person person){
        this.rabbitMessagingTemplate.setMessageConverter(this.mappingJackson2MessageConverter);
        rabbitMessagingTemplate.convertAndSend("TestQ", person);
        System.out.println("Sending Person: "+person);
    }
}

