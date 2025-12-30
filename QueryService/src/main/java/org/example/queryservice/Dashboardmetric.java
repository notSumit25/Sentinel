package org.example.queryservice;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class Dashboardmetric {

    @Autowired
    private Jdbcservice jdbcservice;



}
